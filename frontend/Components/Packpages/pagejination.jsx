"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ totalItems, pageSize = 10 }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get('page')) || 1;
    const totalPages = Math.ceil(totalItems / pageSize);


    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageChange = (newPage) => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.set('page', newPage.toString());
        router.push(`?${currentParams.toString()}`);
    };

    const baseBtnClass = "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";
    const inactiveBtnClass = "bg-gray-100 text-gray-600 hover:bg-gray-200";


    const activeBtnClass = "bg-[#0ea5e9] text-white";

    return (
        <div className="flex items-center justify-center gap-2 mt-8 mb-8">


            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${baseBtnClass} ${inactiveBtnClass} cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
            >
                &lt;
            </button>


            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`${baseBtnClass} ${currentPage === number ? activeBtnClass : inactiveBtnClass
                        } cursor-pointer`}
                >
                    {number}
                </button>
            ))}


            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${baseBtnClass} ${inactiveBtnClass} cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
            >
                &gt;
            </button>

        </div>
    );
}