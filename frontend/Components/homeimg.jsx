import api from '@/lib/api';
import React from 'react';

export default async function PageBanner({ title }) {


    const Homeimg = await api.get("homeimgs/");
    const resdataimg = Homeimg.data?.image || "";


    return (
        <div
            className="relative w-full h-[70vh] min-h-[500px] bg-cover bg-center flex items-center mt-10"
            style={{ backgroundImage: `url(${resdataimg})` }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

            <div className="relative z-10 container mx-auto px-8 md:px-16">
                <div className="max-w-3xl">
                    <h1 className="text-white text-5xl md:text-7xl font-extrabold uppercase tracking-wider mb-6 drop-shadow-lg leading-tight">
                        {title }
                    </h1>
                </div>
            </div>
        </div>
    );
}