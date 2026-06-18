import React from 'react';
import api from '@/lib/api';
import { getLanguage } from '@/lib/lang';
import ProductDetails from '@/Components/ProductDetail/page';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage(props) {
    const params = await props.params;
    const { id } = params;
    const lang = await getLanguage();

    let productData = null;
    try {
        const response = await api.get(`products/${id}/?lang=${lang}`);
        productData = response.data;
    } catch (err) {
        console.error("Error fetching product details:", err);
    }

    if (!productData) {
        notFound();
    }

    return (
        <div>
            <ProductDetails item={productData} />
        </div>
    );
}
