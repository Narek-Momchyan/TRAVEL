"use client";

import React, { useEffect, useState } from 'react';

import { FaSignOutAlt, FaEdit, FaCamera, FaSave, FaTimes } from "react-icons/fa";
import api from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [translations, setTranslations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/register';
        return;
      }

      try {
        const userRes = await api.get('profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);
        setFormData(userRes.data);
        if (userRes.data.avatar) {
          const avatarUrl = userRes.data.avatar.startsWith('http') 
            ? userRes.data.avatar 
            : `http://127.0.0.1:8000${userRes.data.avatar}`;
          setPreviewImage(avatarUrl);
        }

        const getCookie = (name) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
          return null;
        };
        const lang = getCookie('lang') || 'en';
        const transRes = await api.get(`profile-translations/?lang=${lang}`);
        
        if (transRes.data && transRes.data.length > 0) {
          setTranslations(transRes.data[0]);
        }

      } catch (err) {
        console.error(err);
        setError('Failed to load profile. Please log in again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user_wishlist');
        setTimeout(() => {
          window.location.href = '/register';
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_wishlist');
    window.location.replace('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      const submitData = new FormData();
      if (formData.first_name) submitData.append('first_name', formData.first_name);
      if (formData.last_name) submitData.append('last_name', formData.last_name);
      if (formData.country) submitData.append('country', formData.country);
      if (formData.city) submitData.append('city', formData.city);
      if (formData.street) submitData.append('street', formData.street);
      if (formData.postal_code) submitData.append('postal_code', formData.postal_code);
      
      if (formData.avatar instanceof File) {
        submitData.append('avatar', formData.avatar);
      }

      const response = await api.put('profile/', submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(response.data.data);
      if (response.data.data.avatar) {
        const avatarUrl = response.data.data.avatar.startsWith('http')
          ? response.data.data.avatar
          : `http://127.0.0.1:8000${response.data.data.avatar}`;
        setPreviewImage(avatarUrl);
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading || !translations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans mt-24">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-white rounded-2xl shadow p-8 relative">
          
          <div className="flex flex-col md:flex-row items-center md:justify-between border-b border-gray-200 pb-6 mb-6 gap-4">
            
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-gray-400 uppercase">{user.username.charAt(0)}</span>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-md transition-transform hover:scale-105">
                    <FaCamera size={14} />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">{translations.page_title}</h1>
                <p className="text-sm text-gray-500 mt-1">{translations.page_subtitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <>
                  <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <FaEdit />
                    <span className="font-semibold">{translations.edit_btn}</span>
                  </button>
                  <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    <FaSignOutAlt />
                    <span className="font-semibold">{translations.logout_btn}</span>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => {setIsEditing(false); setPreviewImage(user.avatar ? `http://127.0.0.1:8000${user.avatar}` : null); setFormData(user);}} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <FaTimes />
                    <span className="font-semibold">{translations.cancel_btn}</span>
                  </button>
                  <button onClick={handleSave} disabled={saveLoading} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                    <FaSave />
                    <span className="font-semibold">{saveLoading ? '...' : translations.save_btn}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{translations.account_details_title}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{translations.first_name_label}</p>
                  {isEditing ? (
                    <input type="text" name="first_name" value={formData.first_name || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none transition" />
                  ) : (
                    <p className="font-medium text-gray-900">{user.first_name || '-'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{translations.last_name_label}</p>
                  {isEditing ? (
                    <input type="text" name="last_name" value={formData.last_name || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none transition" />
                  ) : (
                    <p className="font-medium text-gray-900">{user.last_name || '-'}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">{translations.username_label}</p>
                <p className="font-medium text-gray-900">{user.username}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">{translations.email_label}</p>
                <p className="font-medium text-gray-900 flex items-center space-x-2">
                  <span>{user.email}</span>
                  {user.is_email_verified && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-semibold">{translations.verified_badge}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{translations.address_info_title}</h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Country</p>
                      <input type="text" name="country" value={formData.country || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">City</p>
                      <input type="text" name="city" value={formData.city || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Street</p>
                    <input type="text" name="street" value={formData.street || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Postal Code</p>
                    <input type="text" name="postal_code" value={formData.postal_code || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none" />
                  </div>
                </div>
              ) : (
                <>
                  {user.country || user.city ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{translations.location_label}</p>
                        <p className="font-medium text-gray-900">{user.city || '-'}, {user.country || '-'}</p>
                      </div>
                      {(user.street || user.postal_code) && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{translations.street_postal_label}</p>
                          <p className="font-medium text-gray-900">{user.street || '-'} {user.postal_code}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
                      <p>{translations.no_address_text}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
