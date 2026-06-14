import React from 'react';
import Homeimg from '@/Components/homeimg';
import Rating from "@/Components/Reyting";
import ContactForm from './ContactForm';

export default function ContactPage() {
    return (
        <div>
            <Homeimg title="contact" />
            <ContactForm />
            <Rating />
        </div>
    );
}