'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './product.module.css'; 
import { FaSearch } from 'react-icons/fa'; 
import { IoIosHeart } from "react-icons/io"; 
import { useWishlist } from '@/context/wishlistcontext';
export default function Product({ products }) {

    const { wishlist, toogletitem: toggleLiked } = useWishlist();




    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [priceMin, setPriceMin] = useState(searchParams.get('min_price') || "");
    const [priceMax, setPriceMax] = useState(searchParams.get('max_price') || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            const current = new URLSearchParams(Array.from(searchParams.entries()));
            
            if (search) {
                current.set('search', search);
            } else {
                current.delete('search'); 
            }
            
            if (priceMin) {
                current.set('min_price', priceMin);
            } else {
                current.delete('min_price');
            }
            
            if (priceMax) {
                current.set('max_price', priceMax);
            } else {
                current.delete('max_price');
            }

            const searchData = current.toString();
            const query = searchData ? `?${searchData}` : '';
            
            const currentQuery = searchParams.toString() ? `?${searchParams.toString()}` : '';
            if (query !== currentQuery) {
                router.push(`${pathname}${query}`, { scroll: false });
            }
            
        }, 500); 

        return () => clearTimeout(timer);
    }, [search, priceMin, priceMax, pathname, router, searchParams]);
  return (
    <div className={styles.container}>
        <div className={styles.filterSection}>
            <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input type="text"  className={styles.searchInput}  value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
            <div className={styles.priceFilterBox}>
                <input type="number" placeholder='min' className={styles.priceInput} value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
                <span className={styles.separator}>-</span>
                <input type="number" placeholder='max' className={styles.priceInput} value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
            </div>
        </div>

        <section className={styles.gridContainer}>
            {       
                products.map((items) => {
                    const isLiked = wishlist.some((w) => w.id === items.id);

                    return (
                        <div key={items.id} className={styles.card} onClick={() => router.push(`/packages/${items.id}`)} 
                    style={{ cursor: 'pointer' }}>
                            <div className={styles.imageWrapper}>
                                <img src={items.images?.[0]} alt={items.title } className={styles.image} />
                                
                                <div className={styles.discountBadge}>
                                    {items.discount_percentage }
                                </div>
                                
                                <div className={styles.bottomBar}>
                                    <IoIosHeart 
                                        className={styles.heartIcon} 
                                        color={isLiked ? 'red' : ''} 
                                        onClick={() => toggleLiked(items)}
                                    />
                                    <span className={styles.title}>{items.title}</span>
                                </div>
                            </div>
                            
                            <div className={styles.cardBody}>
                                <p className={styles.description}>{items.description}</p>
                                <div className={styles.ratingPriceBox}>
                                    <span className={styles.rating}>★ {items.rating}</span>
                                    <span className={styles.price}>{items.price}$</span>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </section>
    </div>
  )
}
