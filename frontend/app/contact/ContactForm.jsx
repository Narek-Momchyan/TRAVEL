"use client";
import React, { useState } from 'react';
import styles from './contact.module.css';
import api from '@/lib/api';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('Sending...');

        try {
            const response = await api.post("contact/", formData);

            if (response.status >= 200 && response.status < 300) {
                setStatus('Your message has been sent successfully!');
                setFormData({ name: '', email: '', message: '' });
            }
        } catch (error) {
            console.error("Error:", error);
            
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.error) {
                    setStatus(errorData.error);
                } else {
                    setStatus('Please check your input and try again.');
                }
            } else {
                setStatus('Error connecting to the server.');
            }
        } finally {
            setLoading(false);
        }
    };

    let statusClass = styles.info;
    if (status.includes('successfully')) {
        statusClass = styles.success;
    } else if (status.includes('error') || status.includes('Please')) {
        statusClass = styles.error;
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formCard}>
                <h2 className={styles.title}>Contact Us</h2>
                <p className={styles.subtitle}>We'd love to hear from you. Please fill out the form below.</p>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <textarea
                            name="message"
                            placeholder="Enter your message..."
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                            className={`${styles.input} ${styles.textarea}`}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={styles.button}
                    >
                        {loading ? (
                            <>
                                <span className={styles.spinner}></span>
                                SENDING...
                            </>
                        ) : 'SEND MESSAGE'}
                    </button>
                </form>
                
                {status && (
                    <div className={`${styles.statusMessage} ${statusClass}`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}
