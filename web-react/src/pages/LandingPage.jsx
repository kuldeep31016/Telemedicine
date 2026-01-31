import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCog, Stethoscope, Heart, Shield, Video, Clock } from 'lucide-react';
import Button from '../components/common/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Video className="w-6 h-6" />, title: 'Video Consultations', desc: 'Connect with doctors remotely' },
    { icon: <Clock className="w-6 h-6" />, title: '24/7 Availability', desc: 'Healthcare whenever you need' },
    { icon: <Shield className="w-6 h-6" />, title: 'Secure & Private', desc: 'Your data is protected' },
    { icon: <Heart className="w-6 h-6" />, title: 'Quality Care', desc: 'Expert medical professionals' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-gray-800">Gram </span>
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Sehat</span>
              </h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
            <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Revolutionizing
                <br />
                Rural Healthcare
                <br />
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  in Punjab
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connecting ASHA workers, doctors, and patients through advanced telemedicine technology for accessible healthcare delivery in rural communities.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant="success"
                  icon={<UserCog className="w-5 h-5" />}
                  onClick={() => navigate('/admin/login')}
                  className="text-lg px-8 py-4"
                >
                  Admin Portal
                </Button>
                
                <Button
                  variant="primary"
                  icon={<Stethoscope className="w-5 h-5" />}
                  onClick={() => navigate('/doctor/login')}
                  className="text-lg px-8 py-4"
                >
                  Doctor Portal
                </Button>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => navigate('/patient/login')}
                  className="text-blue-600 hover:text-blue-700 font-semibold underline"
                >
                  Patient Login →
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="text-green-600 hover:text-green-700 font-semibold underline"
                >
                  New User? Register →
                </button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=700&fit=crop"
                  alt="Doctor"
                  className="rounded-2xl w-full h-[500px] object-cover"
                />
                
                {/* Floating Stats */}
                <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">500+</p>
                      <p className="text-sm text-gray-600">Doctors</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 glass rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">10k+</p>
                      <p className="text-sm text-gray-600">Patients</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4">Why Choose Gram Sehat?</h3>
            <p className="text-xl text-gray-600">Bringing quality healthcare to rural communities</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-white/20 py-8 relative z-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            © 2026 Gram Sehat. Made with ❤️ for accessible healthcare | Smart India Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
