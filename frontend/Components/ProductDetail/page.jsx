'use client'; 
import { useState } from 'react';
import styles from './productPage.module.css';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../Mar/page'), { ssr: false });
export default function ProductDetails({ item }) {
    if (!item) {
        return null;
    }

    const images = item.images || [];
    const [mainImage, setMainImage] = useState(images[0]);

    return (
       <div className={styles.mainWrapper}>
        <div className={styles.container}>
            
            <div className={styles.leftColumn}>
                {mainImage && (
                    <img src={mainImage} alt={item.title} className={styles.mainImage} />
                )}
                
                <div className={styles.infoSection}>
                    <h2 className={styles.title}>{item.title}</h2>
                    <p className={styles.price}>{item.price}$</p>
                    <div className={styles.stars}>⭐{item.rating}</div>
                    <p className={styles.description}>{item.description}</p>
                </div>
            </div>

            <div className={styles.rightColumn}>
                {images.map((imgUrl, index) => (
                    <img 
                        key={index} 
                        src={imgUrl} 
                        alt={`thumbnail ${index}`} 
                        className={styles.thumbnail}
                        onClick={() => setMainImage(imgUrl)}
                        style={{ cursor: 'pointer' }} 
                    />
                ))}
            </div>
        </div>
        <MapComponent lat={item.latitude} lng={item.longitude} locationName={item.title} />
       </div>
    );
}