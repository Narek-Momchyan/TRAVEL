"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '@/lib/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const [step, setStep] = useState(1); 
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      window.location.href = '/profile';
    }

    const fetchTranslations = async () => {
      try {
        const getCookie = (name) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
          return null;
        };
        const lang = getCookie('lang') || 'en';
        const res = await api.get(`auth-translations/?lang=${lang}`);
        if (res.data && res.data.length > 0) {
          setTranslations(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to load auth translations", err);
      }
    };
    fetchTranslations();
  }, []);

  const [formData, setFormData] = useState({
    login: '', username: '', email: '', password: '', otp_code: '',
    country: '', city: '', street: '', postal_code: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const clearMessages = () => {
    setError('');
    setSuccessMsg('');
  };

  const toggleMode = (mode) => {
    setIsLogin(mode);
    setStep(1);
    clearMessages();
  };

  const parseError = (err) => {
    if (err.response?.data) {
      const data = err.response.data;
      if (data.error) {
        if (typeof data.error === 'string') return data.error;
        if (typeof data.error === 'object') return Object.values(data.error).flat().join(', ');
      }
      if (typeof data === 'object') return Object.values(data).flat().join(', ');
      return String(data);
    }
    return err.message || 'An unexpected error occurred.';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      const response = await api.post('login/', {
        login: formData.login,
        password: formData.password,
      });

      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        setSuccessMsg('Successfully logged in! Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please provide an Email Address.');
      return;
    }

    setLoading(true);
    clearMessages();
    
    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        email: formData.email
      };

      const response = await api.post('register/', payload);

      if (response.status === 201) {
        setSuccessMsg('Verification code sent. Please check your messages.');
        setStep(2); 
      }
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      const payload = {
        otp_code: formData.otp_code,
        email: formData.email
      };

      const response = await api.post('verify-otp/', payload);

      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        
        setSuccessMsg('Account verified. Let\'s set up your address.');
        setStep(3); 
      }
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    const token = localStorage.getItem('accessToken');

    try {
      const response = await api.post('profile/address/', {
        country: formData.country,
        city: formData.city,
        street: formData.street,
        postal_code: formData.postal_code,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMsg('Profile completed successfully! Redirecting...');
        setTimeout(() => { window.location.href = '/'; }, 1500);
      }
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
      window.location.href = '/';
  };

  if (!translations) return null; 

  return (
    <div className="min-h-screen mt-20 flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-10">
        
        {(isLogin || step === 1) && (
          <div className="flex justify-center space-x-4 mb-8 border-b pb-4 border-gray-200">
            <button onClick={() => toggleMode(true)} className={`pb-2 text-lg font-bold transition-colors duration-200 ${isLogin ? 'text-[#1a859c] border-b-2 border-[#1a859c]' : 'text-gray-400 hover:text-gray-600'}`}>
              {translations.login_tab}
            </button>
            <button onClick={() => toggleMode(false)} className={`pb-2 text-lg font-bold transition-colors duration-200 ${!isLogin ? 'text-[#1a859c] border-b-2 border-[#1a859c]' : 'text-gray-400 hover:text-gray-600'}`}>
              {translations.signup_tab}
            </button>
          </div>
        )}

        <div className="text-center -mt-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isLogin && translations.welcome_back_title}
            {!isLogin && step === 1 && translations.create_account_title}
            {!isLogin && step === 2 && translations.verify_account_title}
            {!isLogin && step === 3 && translations.add_address_title}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin && translations.welcome_back_subtitle}
            {!isLogin && step === 1 && translations.create_account_subtitle}
            {!isLogin && step === 2 && translations.verify_account_subtitle}
            {!isLogin && step === 3 && translations.add_address_subtitle}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex"><div className="ml-3"><p className="text-sm text-red-700">{error}</p></div></div>
          </div>
        )}
        
        {successMsg && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
            <div className="flex"><div className="ml-3"><p className="text-sm text-green-700">{successMsg}</p></div></div>
          </div>
        )}

        {isLogin && (
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{translations.email_username_label}</label>
                <input type="text" name="login" value={formData.login} onChange={handleChange} required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring focus:ring-blue-200 transition sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{translations.password_label}</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring focus:ring-blue-200 transition sm:text-sm" />
              </div>
            </div>
            <div>
              <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1a859c] hover:bg-[#0b698f] focus:outline-none focus:ring focus:ring-[#d4e8ed] disabled:opacity-50 transition-all">
                {loading ? '...' : translations.signin_btn}
              </button>
            </div>
          </form>
        )}

        {!isLogin && (
          <div className="mt-8">
            
            {step === 1 && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translations.username_label}</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 transition sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translations.email_label}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 transition sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translations.password_label} *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 transition sm:text-sm" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1a859c] hover:bg-[#0b698f] focus:outline-none focus:ring focus:ring-[#d4e8ed] disabled:opacity-50 transition-all">
                  {loading ? '...' : translations.signup_btn}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-center">{translations.code_label}</label>
                  <input type="text" name="otp_code" value={formData.otp_code} onChange={handleChange} required maxLength="6"
                    className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center tracking-[0.75em] text-2xl font-mono" />
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all">
                  {loading ? '...' : translations.verify_btn}
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleAddressSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{translations.country_label}</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{translations.city_label}</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{translations.street_label}</label>
                  <input type="text" name="street" value={formData.street} onChange={handleChange} required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{translations.postal_code_label}</label>
                  <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  <button type="button" onClick={handleSkip} className="w-1/3 flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    {translations.skip_btn}
                  </button>
                  <button type="submit" disabled={loading} className="w-2/3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors">
                    {loading ? '...' : translations.save_profile_btn}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
