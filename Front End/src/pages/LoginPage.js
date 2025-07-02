import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaPhone, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    confirmPassword: ''
  });

  const [phoneCode, setPhoneCode] = useState('');
  const [phoneStep, setPhoneStep] = useState('phone'); // 'phone' or 'code'

  const { login, register, googleLogin, sendPhoneCode, verifyPhoneCode } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber: value || ''
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isPhoneAuth) {
        if (phoneStep === 'phone') {
          await sendPhoneCode(formData.phoneNumber);
          setPhoneStep('code');
          setSuccess('Verification code sent to your phone!');
        } else {
          await verifyPhoneCode(formData.phoneNumber, phoneCode);
          setSuccess('Phone verification successful!');
        }
      } else {
        if (isLogin) {
          await login(formData.email, formData.password);
        } else {
          if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match');
          }
          await register({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // For demo purposes, we'll simulate Google login
      // In a real app, you'd integrate with Google OAuth
      toast.error('Google OAuth integration required');
    } catch (err) {
      setError('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      confirmPassword: ''
    });
  };

  const togglePhoneAuth = () => {
    setIsPhoneAuth(!isPhoneAuth);
    setPhoneStep('phone');
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      confirmPassword: ''
    });
  };

  const resetPhoneAuth = () => {
    setPhoneStep('phone');
    setPhoneCode('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        {/* Brand Section */}
        <div className="brand">
          <div className="brand-logo">🚗</div>
          <h1 className="brand-title">MyRideLink</h1>
          <p className="brand-subtitle">
            {isPhoneAuth 
              ? 'Secure phone authentication' 
              : isLogin 
                ? 'Welcome back to your account' 
                : 'Create your account to get started'
            }
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Phone Authentication */}
        {isPhoneAuth ? (
          <form onSubmit={handleSubmit} className="slide-up">
            {phoneStep === 'phone' ? (
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="phone-input-container">
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    className="phone-input"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Verification Code</label>
                <input
                  type="text"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className="form-input"
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                />
                <button
                  type="button"
                  onClick={resetPhoneAuth}
                  className="btn btn-secondary"
                  style={{ marginTop: '12px', width: '100%' }}
                >
                  Back to Phone Number
                </button>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-phone ${loading ? 'btn-loading' : ''}`}
              disabled={loading || (phoneStep === 'phone' ? !formData.phoneNumber : !phoneCode)}
            >
              {loading ? 'Processing...' : phoneStep === 'phone' ? 'Send Code' : 'Verify Code'}
            </button>
          </form>
        ) : (
          /* Email Authentication */
          <form onSubmit={handleSubmit} className="slide-up">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <div style={{ position: 'relative' }}>
                    <FaUser style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="form-input"
                      style={{ paddingLeft: '48px' }}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <div style={{ position: 'relative' }}>
                    <FaUser style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="form-input"
                      style={{ paddingLeft: '48px' }}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ paddingLeft: '48px' }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ paddingLeft: '48px', paddingRight: '48px' }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ paddingLeft: '48px' }}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="divider">or</div>

        {/* Social Login Buttons */}
        <button
          onClick={handleGoogleLogin}
          className={`btn btn-google ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
        >
          <FcGoogle style={{ marginRight: '12px', fontSize: '20px' }} />
          Continue with Google
        </button>

        <button
          onClick={togglePhoneAuth}
          className={`btn btn-phone ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
        >
          <FaPhone style={{ marginRight: '12px' }} />
          {isPhoneAuth ? 'Use Email Instead' : 'Continue with Phone'}
        </button>

        {/* Form Toggle */}
        <div className="form-toggle">
          {isPhoneAuth ? (
            <span>
              Don't have an account?
              <a href="#" onClick={togglePhoneAuth}>Sign up with email</a>
            </span>
          ) : (
            <span>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <a href="#" onClick={toggleAuthMode}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 