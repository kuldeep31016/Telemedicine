import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Briefcase, 
  Award, 
  DollarSign,
  Globe,
  Building,
  FileText,
  Save,
  Clock,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Calendar,
  Camera,
  Upload
} from 'lucide-react';
import { doctorAPI } from '../../api/doctor.api';
import { toast } from 'react-hot-toast';

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: '',
    experience: 0,
    hourlyRate: 500,
    languages: [],
    availability: 'Available Today',
    about: '',
    hospitalName: '',
    registrationNumber: '',
    gender: 'Male',
    profileImage: ''
  });

  const specializationOptions = [
    'Cardiologist', 'Neurologist', 'Gynecologist', 'Pediatrician',
    'Dermatologist', 'Orthopedic', 'Psychiatrist', 'General Physician',
    'ENT Specialist', 'Ophthalmologist'
  ];

  const availabilityOptions = [
    'Available Today', 'Available Tomorrow', 'Available This Week', 'Busy', 'On Leave'
  ];

  const languageOptions = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Punjabi'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('[Profile] Fetching doctor profile...');
      const response = await doctorAPI.getMyProfile();
      console.log('[Profile] API response:', response);
      
      if (response && response.success && response.data) {
        const data = response.data;
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          specialization: data.specialization || '',
          experience: data.experience || 0,
          hourlyRate: data.hourlyRate || 500,
          languages: data.languages || ['English', 'Hindi'],
          availability: data.availability || 'Available Today',
          about: data.about || '',
          hospitalName: data.hospitalName || '',
          registrationNumber: data.registrationNumber || '',
          gender: data.gender || 'Male',
          profileImage: data.profileImage || ''
        });
        console.log('[Profile] Profile loaded successfully');
      }
    } catch (error) {
      console.error('[Profile] Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG and WebP images are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      console.log('[Profile] Uploading profile image...');
      const response = await doctorAPI.uploadProfileImage(file);
      console.log('[Profile] Upload response:', response);

      if (response && response.success) {
        setProfile(response.data);
        setFormData(prev => ({ ...prev, profileImage: response.data.profileImage }));
        toast.success('Profile picture uploaded successfully!');
      }
    } catch (error) {
      console.error('[Profile] Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleLanguageToggle = (lang) => {
    setFormData(prev => {
      const languages = prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages };
    });
  };

  const handleSave = async () => {
    console.log('[Profile] Save button clicked');
    console.log('[Profile] Form data:', formData);

    if (!formData.name || !formData.phone || !formData.specialization) {
      toast.error('Please fill in Name, Phone, and Specialization');
      return;
    }

    if (formData.languages.length === 0) {
      toast.error('Please select at least one language');
      return;
    }

    try {
      setSaving(true);
      console.log('[Profile] Calling updateProfile API...');
      
      const payload = {
        name: formData.name,
        phone: formData.phone,
        specialization: formData.specialization,
        experience: Number(formData.experience) || 0,
        hourlyRate: Number(formData.hourlyRate) || 500,
        languages: formData.languages,
        availability: formData.availability,
        about: formData.about,
        hospitalName: formData.hospitalName,
        registrationNumber: formData.registrationNumber,
        gender: formData.gender,
        profileImage: formData.profileImage
      };

      console.log('[Profile] Payload:', JSON.stringify(payload, null, 2));
      
      const response = await doctorAPI.updateProfile(payload);
      console.log('[Profile] Update response:', response);
      
      if (response && response.success) {
        setProfile(response.data);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Update failed - unexpected response');
        console.error('[Profile] Unexpected response:', response);
      }
    } catch (error) {
      console.error('[Profile] Error updating profile:', error);
      console.error('[Profile] Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="mb-4 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Edit Profile</h1>
          <p className="text-slate-600">Update your professional information. Click Save to apply changes.</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10">
            <div className="flex items-center gap-6">
              {/* Profile Image with Upload */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white/20 border-4 border-white shadow-lg">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage.startsWith('http') ? formData.profileImage : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'}${formData.profileImage}`}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <User size={56} />
                    </div>
                  )}
                </div>
                {/* Upload Overlay */}
                <label
                  htmlFor="profileImageUpload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 size={28} className="text-white animate-spin" />
                  ) : (
                    <div className="text-center text-white">
                      <Camera size={24} className="mx-auto mb-1" />
                      <span className="text-xs font-medium">Upload</span>
                    </div>
                  )}
                </label>
                <input
                  id="profileImageUpload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
              <div className="flex-1 text-white">
                <h2 className="text-3xl font-bold mb-1">{formData.name || 'Doctor Name'}</h2>
                <p className="text-blue-100 text-lg mb-1">{formData.specialization || 'Specialization'}</p>
                <p className="text-blue-100 text-sm">{profile?.email || ''}</p>
                <p className="text-blue-200 text-xs mt-1">Hover on image to upload new photo</p>
              </div>
            </div>
          </div>

          {/* Form - Always editable */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <User size={16} className="inline mr-2" />Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Dr. John Doe"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Phone size={16} className="inline mr-2" />Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="+91 9876543210"
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Briefcase size={16} className="inline mr-2" />Specialization *
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  <option value="">Select specialization</option>
                  {specializationOptions.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Award size={16} className="inline mr-2" />Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="5"
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <DollarSign size={16} className="inline mr-2" />Consultation Fee (₹)
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="500"
                />
              </div>

              {/* Hospital Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Building size={16} className="inline mr-2" />Hospital / Clinic Name
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="City General Hospital"
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <FileText size={16} className="inline mr-2" />Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="MC/825421"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <User size={16} className="inline mr-2" />Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Availability */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Clock size={16} className="inline mr-2" />Availability Status
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  {availabilityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Languages */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  <Globe size={16} className="inline mr-2" />Languages Spoken *
                </label>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageToggle(lang)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        formData.languages.includes(lang)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lang}
                      {formData.languages.includes(lang) && (
                        <CheckCircle size={14} className="inline ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* About */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <FileText size={16} className="inline mr-2" />About / Bio
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  placeholder="Tell patients about yourself, your expertise, and approach to healthcare..."
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {saving ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={22} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Profile Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Calendar className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">{profile?.rating || 4.5}</p>
                  <p className="text-sm text-slate-600 font-medium">Rating</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-600 rounded-xl">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">120+</p>
                  <p className="text-sm text-slate-600 font-medium">Reviews</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <Award className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">{profile?.experience || 0}</p>
                  <p className="text-sm text-slate-600 font-medium">Years Exp.</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-600 rounded-xl">
                  <Clock className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-600">
                    {profile?.availability?.includes('Today') ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-slate-600 font-medium">Available</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorProfile;
