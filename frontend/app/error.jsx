'use client';

import React, { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-slate-800 font-sans">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        
        <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 text-red-400">
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-red-400 mb-3 tracking-tight">
          Oops! Something went wrong.
        </h1>
        
        <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
          We encountered an unexpected issue. Don't worry, it's not your fault. Please try again.
        </p>
        
        <button
          onClick={() => reset()}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95"
        >
          Try Again
        </button>

      </div>
    </div>
  );
}