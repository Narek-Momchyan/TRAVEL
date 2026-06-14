"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '@/lib/api';
const AuthForm = () => {
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const getCookie = (name) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
          return null;
        };
        const lang = getCookie('lang') || 'en';
        const res = await api.get(`/auth-translations/?lang=${lang}`);
        if (res.data && res.data.length > 0) {
          setTranslations(res.data[0]);
        } else {
          setTranslations({});
        }
      } catch (err) {
        console.error("Failed to load auth translations", err);
        setTranslations({});
      }
    };
    fetchTranslations();
  }, []);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone_number: '',
    otp_code: '',
    country: '',
    city: '',
    street: '',
    postal_code: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.email && !formData.phone_number) {
      setError(translations?.err_fill_email_or_phone);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const payload = {
        username: formData.username,
        password: formData.password,
      };
      if (formData.email) payload.email = formData.email;
      if (formData.phone_number) payload.phone_number = formData.phone_number;

      const response = await api.post(`/register/`, payload);

      if (response.status === 201) {
        setSuccessMsg(translations?.msg_code_sent);
        setStep(2); 
      }
    } catch (err) {
      setError(err.response?.data?.error || translations?.err_registration_failed);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        otp_code: formData.otp_code,
      };
      if (formData.email) payload.email = formData.email;
      if (formData.phone_number) payload.phone_number = formData.phone_number;

      const response = await api.post(`/verify-otp/`, payload);

      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        
        setSuccessMsg(translations?.msg_login_success);
        setStep(3); 
      }
    } catch (err) {
      setError(err.response?.data?.error || translations?.err_invalid_code);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/profile/address/',
        {
          country: formData.country,
          city: formData.city,
          street: formData.street,
          postal_code: formData.postal_code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMsg(translations?.msg_profile_complete  );
        setTimeout(() => {
            window.location.href = '/'; 
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || translations?.err_address_save_failed );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
      window.location.href = '/';
  };

  return (
    <div className="min-h-screen mt-10 flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {step === 1 && (translations?.step1_title )}
          {step === 2 && (translations?.step2_title )}
          {step === 3 && (translations?.step3_title )}
        </h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
        {successMsg && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">{successMsg}</div>}

        {step === 1 && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">{translations?.lbl_username_asterisk || 'Անուն (Username) *'}</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="p-3 bg-gray-50 border rounded-lg space-y-3">
              <p className="text-xs text-gray-500 text-center mb-2">{translations?.lbl_fill_email_or_phone}</p>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">{translations?.lbl_email}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={translations?.placeh_email}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="text-center text-gray-400 text-sm font-bold">{translations?.lbl_or}</div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">{translations?.lbl_phone}</label>
                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder={translations?.placeh_phone}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">{translations?.lbl_password_asterisk}</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#1a859c] text-white font-bold py-2 px-4 rounded-md hover:bg-[#0b698f] transition-colors disabled:opacity-50 mt-2">
              {loading ? (translations?.btn_wait) : (translations?.btn_register)}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">{translations?.lbl_enter_code}</label>
              <input type="text" name="otp_code" value={formData.otp_code} onChange={handleChange} required maxLength="6"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-lg" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#1a859c] text-white font-bold py-2 px-4 rounded-md hover:bg-[#0b698f] transition-colors disabled:opacity-50">
              {loading ? (translations?.btn_verifying) : (translations?.btn_verify)}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">{translations?.lbl_country_asterisk}</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">{translations?.lbl_city_asterisk}</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">{translations?.lbl_street_asterisk}</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">{translations?.lbl_postal_code_no_asterisk}</label>
              <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="flex space-x-3 pt-2">
                <button type="button" onClick={handleSkip}
                  className="w-1/3 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400">
                  {translations?.btn_skip_action}
                </button>
                <button type="submit" disabled={loading}
                  className="w-2/3 bg-[#1a859c] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#0b698f] disabled:opacity-50">
                  {loading ? (translations?.btn_saving) : (translations?.btn_save_address)}
                </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;