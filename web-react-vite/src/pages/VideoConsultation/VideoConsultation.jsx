/**
 * Video Consultation Component
 * Agora video call interface for doctor-patient consultations
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  ScreenShare,
  StopScreenShare,
  Close
} from '@mui/icons-material';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { videoAPI } from '../../api/video.api';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const VideoConsultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [validation, setValidation] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [waitingForDoctor, setWaitingForDoctor] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  
  // Agora client and tracks
  const [client] = useState(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState({});

  // Controls
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  // Exit confirmation
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  // Check if user is doctor
  const isDoctor = user?.role === 'doctor';

  useEffect(() => {
    validateConsultation();
    return () => {
      leaveCall();
    };
  }, [appointmentId]);

  // Poll for call status if patient is waiting
  useEffect(() => {
    let pollInterval;
    if (waitingForDoctor && !callStarted) {
      pollInterval = setInterval(async () => {
        try {
          const statusResponse = await videoAPI.getCallStatus(appointmentId);
          if (statusResponse.success && statusResponse.data.callStarted) {
            setCallStarted(true);
            setWaitingForDoctor(false);
            toast.success('Doctor has joined! Connecting...');
            // Auto join when doctor starts
            await joinCall();
          }
        } catch (error) {
          console.error('Poll status error:', error);
        }
      }, 3000); // Poll every 3 seconds
    }
    
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [waitingForDoctor, callStarted, appointmentId]);

  const validateConsultation = async () => {
    try {
      setLoading(true);
      const response = await videoAPI.validateConsultation(appointmentId);
      
      if (response.success) {
        setValidation(response.data);
        setCallStarted(response.data.callStarted || false);
        if (!response.data.canJoin) {
          toast.error(response.data.reason || 'Cannot join consultation');
        }
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to validate consultation');
    } finally {
      setLoading(false);
    }
  };

  const startConsultation = async () => {
    try {
      // Mark consultation as started
      await videoAPI.startConsultation(appointmentId);
      setCallStarted(true);
      toast.success('Consultation started');
      // Then join the call
      await joinCall();
    } catch (error) {
      console.error('Start consultation error:', error);
      toast.error('Failed to start consultation');
    }
  };

  const joinCall = async () => {
    try {
      setJoining(true);

      // For patients, check if doctor has started the call
      if (!isDoctor && !callStarted) {
        setWaitingForDoctor(true);
        setJoining(false);
        toast.info('Waiting for doctor to start consultation...');
        return;
      }

      // Generate token from backend
      const tokenResponse = await videoAPI.generateToken(appointmentId);
      
      if (!tokenResponse.success) {
        throw new Error(tokenResponse.message || 'Failed to generate token');
      }

      setTokenData(tokenResponse.data);
      const { token, channelName, uid, appId } = tokenResponse.data;

      // Setup event listeners
      client.on('user-published', handleUserPublished);
      client.on('user-unpublished', handleUserUnpublished);
      client.on('user-left', handleUserLeft);

      // Join channel
      await client.join(appId, channelName, token, uid);

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      // Play local video
      videoTrack.play('local-player');

      // Publish tracks
      await client.publish([audioTrack, videoTrack]);

      setInCall(true);
      toast.success('Joined consultation successfully');
    } catch (error) {
      console.error('Join call error:', error);
      toast.error(error.message || 'Failed to join call');
    } finally {
      setJoining(false);
    }
  };

  const leaveCall = async () => {
    try {
      // Stop local tracks
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }

      // Remove remote users
      setRemoteUsers({});

      // Leave channel
      await client.leave();

      setInCall(false);
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      
      toast.success('Left consultation');
    } catch (error) {
      console.error('Leave call error:', error);
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setRemoteUsers(prev => ({ ...prev, [user.uid]: user }));
      
      // Wait for DOM to update
      setTimeout(() => {
        const remoteContainer = document.getElementById(`remote-player-${user.uid}`);
        if (remoteContainer) {
          user.videoTrack?.play(remoteContainer);
        }
      }, 100);
    }

    if (mediaType === 'audio') {
      user.audioTrack?.play();
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    if (mediaType === 'video') {
      setRemoteUsers(prev => {
        const updated = { ...prev };
        delete updated[user.uid];
        return updated;
      });
    }
  };

  const handleUserLeft = (user) => {
    setRemoteUsers(prev => {
      const updated = { ...prev };
      delete updated[user.uid];
      return updated;
    });
    toast.info('Other participant left');
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!audioEnabled);
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!videoEnabled);
      setVideoEnabled(!videoEnabled);
    }
  };

  const handleEndCall = () => {
    setExitDialogOpen(true);
  };

  const confirmEndCall = async () => {
    try {
      // Mark consultation as ended
      await videoAPI.endConsultation(appointmentId);
      await leaveCall();
      setExitDialogOpen(false);
      toast.success('Consultation ended');
      navigate(-1);
    } catch (error) {
      console.error('End consultation error:', error);
      // Still leave the call even if API fails
      await leaveCall();
      setExitDialogOpen(false);
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!validation?.canJoin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
        <Card sx={{ maxWidth: 500 }}>
          <CardContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              {validation?.reason || 'Cannot join consultation'}
            </Alert>
            <Button variant="contained" onClick={() => navigate(-1)} fullWidth>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Waiting room for patient
  if (waitingForDoctor) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#1a1a1a', p: 3 }}>
        <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Waiting for Doctor
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The doctor hasn't started the consultation yet. Please stay on this screen.
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              You will automatically join when the doctor starts the consultation
            </Alert>
            <Button variant="outlined" onClick={() => navigate(-1)} fullWidth>
              Cancel and Go Back
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Pre-call screen (doctor needs to start, patient ready to join)
  if (!inCall && !joining) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#1a1a1a', p: 3 }}>
        <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {isDoctor ? 'Start Consultation' : 'Join Consultation'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {isDoctor 
                ? 'Click below to start the video consultation with your patient' 
                : 'Click below to join the video consultation with your doctor'}
            </Typography>
            {validation?.appointment && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {isDoctor ? 'Patient' : 'Doctor'}: {isDoctor ? validation.appointment.patientName : validation.appointment.doctorName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time: {validation.appointment.time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {validation.appointment.consultationDuration || 15} minutes
                </Typography>
              </Box>
            )}
            <Button 
              variant="contained" 
              color="success"
              size="large"
              onClick={isDoctor ? startConsultation : joinCall}
              disabled={joining}
              fullWidth
              sx={{ mb: 2 }}
            >
              {joining ? 'Joining...' : (isDoctor ? 'Start Consultation' : 'Join Now')}
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)} fullWidth>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', bgcolor: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#2d2d2d', 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Box>
          <Typography variant="h6" color="white">
            Video Consultation
          </Typography>
          <Typography variant="caption" color="grey.400">
            {validation?.appointment?.patientName && validation?.appointment?.doctorName
              ? `${validation.appointment.patientName} - ${validation.appointment.doctorName}`
              : 'Loading...'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip 
            label={inCall ? 'In Call' : 'Ready'} 
            color={inCall ? 'success' : 'default'}
            size="small"
          />
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Video Grid */}
      <Box sx={{ flex: 1, display: 'flex', gap: 2, p: 2, overflow: 'hidden' }}>
        {/* Remote Video (Main) */}
        {Object.keys(remoteUsers).length > 0 ? (
          <Box sx={{ flex: 1, position: 'relative', bgcolor: '#000', borderRadius: 2, overflow: 'hidden' }}>
            {Object.entries(remoteUsers).map(([uid, user]) => (
              <Box
                key={uid}
                id={`remote-player-${uid}`}
                sx={{ width: '100%', height: '100%' }}
              />
            ))}
            <Typography 
              sx={{ 
                position: 'absolute', 
                bottom: 16, 
                left: 16, 
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.6)',
                px: 2,
                py: 1,
                borderRadius: 1
              }}
            >
              {tokenData?.userRole === 'doctor' ? 'Patient' : 'Doctor'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            flex: 1, 
            bgcolor: '#000', 
            borderRadius: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography color="grey.500">
              Waiting for other participant...
            </Typography>
          </Box>
        )}

        {/* Local Video (Small) */}
        {inCall && (
          <Box sx={{ 
            width: 280, 
            height: 210, 
            position: 'absolute', 
            bottom: 100, 
            right: 24,
            bgcolor: '#000', 
            borderRadius: 2, 
            overflow: 'hidden',
            border: '2px solid #fff'
          }}>
            <Box id="local-player" sx={{ width: '100%', height: '100%' }} />
            <Typography 
              sx={{ 
                position: 'absolute', 
                bottom: 8, 
                left: 8, 
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.6)',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.875rem'
              }}
            >
              You
            </Typography>
            {!videoEnabled && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: '#2d2d2d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography color="grey.400">Camera Off</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Box sx={{ 
        bgcolor: '#2d2d2d', 
        p: 3, 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2 
      }}>
        {!inCall ? (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={joinCall}
            disabled={joining}
            startIcon={joining ? <CircularProgress size={20} /> : <Videocam />}
            sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
          >
            {joining ? 'Joining...' : 'Join Consultation'}
          </Button>
        ) : (
          <>
            <IconButton 
              onClick={toggleAudio}
              sx={{ 
                bgcolor: audioEnabled ? '#3a3a3a' : '#f44336', 
                color: 'white',
                width: 56,
                height: 56,
                '&:hover': { bgcolor: audioEnabled ? '#4a4a4a' : '#d32f2f' }
              }}
            >
              {audioEnabled ? <Mic /> : <MicOff />}
            </IconButton>

            <IconButton 
              onClick={toggleVideo}
              sx={{ 
                bgcolor: videoEnabled ? '#3a3a3a' : '#f44336', 
                color: 'white',
                width: 56,
                height: 56,
                '&:hover': { bgcolor: videoEnabled ? '#4a4a4a' : '#d32f2f' }
              }}
            >
              {videoEnabled ? <Videocam /> : <VideocamOff />}
            </IconButton>

            <IconButton 
              onClick={handleEndCall}
              sx={{ 
                bgcolor: '#f44336', 
                color: 'white',
                width: 56,
                height: 56,
                '&:hover': { bgcolor: '#d32f2f' }
              }}
            >
              <CallEnd />
            </IconButton>
          </>
        )}
      </Box>

      {/* Exit Confirmation Dialog */}
      <Dialog open={exitDialogOpen} onClose={() => setExitDialogOpen(false)}>
        <DialogTitle>End Consultation?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to end this consultation? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExitDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmEndCall} color="error" variant="contained">
            End Call
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoConsultation;
