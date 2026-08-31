import api from '@/lib/api';
import React from 'react';

export default async function PageBanner({ title }) {
    const response = await api.get("homeimgs/");
    let videoUrl = response.data?.image;
    if (videoUrl && videoUrl.includes("backend:8000")) {
        videoUrl = videoUrl.replace("backend:8000", "localhost:8000");
    }

    return (
        <div className="relative w-full h-[70vh] min-h-[600px] flex items-center mt-10 overflow-hidden">
            {videoUrl && (
                <video 
                    src={videoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover -z-20"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent -z-10"></div>
            <div className="relative z-10 container mx-auto px-8 md:px-16">
                <div className="max-w-3xl">
                    <h1 className="text-white text-5xl md:text-7xl font-extrabold uppercase tracking-wider mb-6 drop-shadow-lg leading-tight">
                        {title}
                    </h1>
                </div>
            </div>
            
        </div>
    );
}