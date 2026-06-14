'use client'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import styles from './popularProduct.module.css';
import { useRouter } from 'next/navigation';

export default function Popularproduct({ products }) {
  const router = useRouter();
  const [swiperKey, setSwiperKey] = useState('initial');

  useEffect(() => {
    setSwiperKey(Date.now().toString());
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.swiperWrapper}>
        <Swiper
          key={swiperKey}
          onSwiper={(swiper) => {
            setTimeout(() => {
              swiper.update();
            }, 100);
          }}
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          initialSlide={3}
          loop={true}
          observer={true}
          observeParents={true}
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
          className={styles.swiper}
        >

          {products?.map((item) => (
            <SwiperSlide key={item.id} className={styles.slide}>
              <div
                className={styles.card}
                onClick={() => router.push(`/packages/${item.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={`${item.images?.[0]}?v=1`}
                    alt={item.title}
                    className={styles.cardImage}
                  />
                  {item.discount_percentage > 0 && (
                    <span className={styles.badge}>-{item.discount_percentage}%</span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.tag}>{item.tag}</span>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.description}</p>
                  <div className={styles.cardFooter}>
                    <div className={styles.priceBlock}>
                      {item.discount_percentage > 0 && (
                        <span className={styles.oldPrice}>${item.price.toLocaleString()}</span>
                      )}
                      <span className={styles.price}>
                        ${(item.price * (1 - item.discount_percentage / 100)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </span>
                    </div>
                    <div className={styles.stars}>
                      {Array.from({ length: item.rating || 0 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}