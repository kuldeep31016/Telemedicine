import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, MessageCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import api from '../../../config/axios';
import useAuthStore from '../../../store/authStore';

const ChatWindow = ({ isOpen, onClose, appointment }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [socket, setSocket] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const { user } = useAuthStore();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isOpen || !appointment) return;

        // Initialize Socket.io connection
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
        const newSocket = io(backendUrl, {
            transports: ['websocket', 'polling'],
            withCredentials: true
        });

        setSocket(newSocket);

        // Join appointment chat room
        newSocket.emit('join_chat', appointment.id);
        console.log('[Chat] Joined room:', appointment.id);

        // Listen for incoming messages
        newSocket.on('receive_message', (message) => {
            console.log('[Chat] Received message:', message);
            setMessages(prev => {
                // Remove optimistic message if it exists (same message text and sender)
                const messageSenderId = message.senderId?._id || message.senderId;
                const filtered = prev.filter(msg => {
                    if (!msg.isOptimistic) return true;
                    const msgSenderId = msg.senderId?._id || msg.senderId;
                    return !(msg.message === message.message && msgSenderId === messageSenderId);
                });
                // Add the real message from server
                return [...filtered, message];
            });
        });

        // Listen for typing indicators
        newSocket.on('user_typing', ({ userName }) => {
            setIsTyping(true);
        });

        newSocket.on('user_stop_typing', () => {
            setIsTyping(false);
        });

        // Fetch existing messages
        fetchMessages();

        return () => {
            newSocket.disconnect();
        };
    }, [isOpen, appointment]);

    const fetchMessages = async () => {
        if (!appointment || !appointment.id) return;

        setLoading(true);
        try {
            const response = await api.get(`/v1/chat/${appointment.id}/messages`);

            if (response.data.success) {
                setMessages(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleTyping = () => {
        if (!socket || !appointment || !user) return;

        socket.emit('typing', {
            appointmentId: appointment.id,
            userName: user.name || 'User'
        });

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { appointmentId: appointment.id });
        }, 1000);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !appointment || !user || sending) return;

        const messageText = newMessage.trim();
        setNewMessage('');
        setSending(true);

        try {
            // Determine sender and receiver based on user role
            let senderModel, receiverModel, receiverId;

            if (user.role === 'doctor') {
                senderModel = 'Doctor';
                receiverModel = 'Patient';
                receiverId = appointment.patientId;
            } else {
                senderModel = 'Patient';
                receiverModel = 'Doctor';
                receiverId = appointment.doctorId;
            }

            // Optimistically add message to UI immediately
            const optimisticMessage = {
                _id: Date.now().toString(), // Temporary ID
                message: messageText,
                senderId: user._id,
                senderModel,
                createdAt: new Date().toISOString(),
                isOptimistic: true // Flag to identify optimistic messages
            };
            
            setMessages(prev => [...prev, optimisticMessage]);

            // Emit message via Socket.io
            const messageData = {
                appointmentId: appointment.id,
                senderId: user._id,
                senderModel,
                receiverId,
                receiverModel,
                message: messageText
            };
            console.log('[Chat] Sending message:', messageData);
            socket.emit('send_message', messageData);

            // Stop typing indicator
            socket.emit('stop_typing', { appointmentId: appointment.id });
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
            setNewMessage(messageText); // Restore message on error
        } finally {
            setSending(false);
        }
    };

    const getOtherPartyName = () => {
        if (!appointment) return 'Chat';
        
        if (user?.role === 'doctor') {
            return appointment.patientId?.name || 'Patient';
        } else {
            return ` ${appointment.doctor || 'Doctor'}`;
        }
    };

    const isMyMessage = (message) => {
        return message.senderId?._id === user._id || message.senderId === user._id;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />
                
                {/* Chat Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <MessageCircle size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{getOtherPartyName()}</h3>
                                <p className="text-xs text-blue-100">
                                    {appointment?.appointmentDate && new Date(appointment.appointmentDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <MessageCircle size={48} className="mb-2" />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            <>
                                {/* Pinned Professional Guidance Message */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-blue-900 mb-1">📌 Communication Guidelines</h4>
                                            <p className="text-xs text-blue-800 leading-relaxed">
                                                {user?.role === 'patient' 
                                                    ? 'For efficient consultation, please describe your symptoms clearly and concisely. Include when symptoms started, severity, and any relevant medical history.'
                                                    : 'Please provide clear, professional responses to patient queries. Ask specific questions to better understand their condition.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {messages.map((message, index) => (
                                    <div
                                        key={message._id || index}
                                        className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                                isMyMessage(message)
                                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                                            }`}
                                        >
                                            <p className="text-sm break-words">{message.message}</p>
                                            <p className={`text-[10px] mt-1 ${
                                                isMyMessage(message) ? 'text-blue-100' : 'text-gray-400'
                                            }`}>
                                                {new Date(message.createdAt).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t bg-white p-4">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    handleTyping();
                                }}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                disabled={sending}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || sending}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {sending ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <Send size={20} />
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ChatWindow;
