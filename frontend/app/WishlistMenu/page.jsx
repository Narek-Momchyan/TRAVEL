"use client";
import { useState , useEffect } from "react"
import { useWishlist } from "@/context/wishlistcontext"
import {IoIosHeart} from "react-icons/io"   
import styles from "./wishlist.module.css"
import {useRouter} from "next/navigation";

export default function wishlistMenu() {

    const {wishlist , isLoading} = useWishlist();
    const [showDroptown , setSowDroptown] = useState(false);
    const router = useRouter();
    const [isClient , setIsclient] = useState(false);

    useEffect(() => {
        setIsclient(true)
    }, []);
    
    if(!isClient) return <div className={styles.container}><IoIosHeart size={28} className={styles.heartIcon}/></div>

    
  return (
    <div 
            className={styles.container}
            onMouseEnter={() => setSowDroptown(true)}
            onMouseLeave={() => setSowDroptown(false)}
        >
            <div className={styles.iconWrapper}>
                <IoIosHeart size={28} className={styles.heartIcon} />
                {isClient && wishlist.length > 0 && (
                    <span className={styles.badge}>{wishlist.length}</span>
                )}
            </div>

            {showDroptown && (
                <div className={styles.dropdown}>
                    {wishlist.length === 0 ? (
                        <div className={styles.empty}>No products added to wishlist</div>
                    ) : (
                        wishlist.map((item) => (
                            <div key={item.id} className={styles.dropdownItem} onClick={()=>router.push(`/packages/${item.id}`)}>
                                <img src={item.images?.[0]} alt={item.title} className={styles.itemImage} />
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemTitle}>{item.title}</span>
                                    {item.price && <span className={styles.itemPrice}>${item.price}</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
  )
}
