"use client"
import {createContext, useEffect, useState, useContext} from "react"
import api from "@/lib/api"

const WishlistContex = createContext();

export function WishlistProvider({children}) {
    const [wishlist, setWishlist] = useState([])
    const [isLoading, setIsloading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            api.get('favorites/', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                const data = res.data.results || res.data;
                const products = data.map(fav => fav.product_details);
                setWishlist(products);
            }).catch(err => {
                console.error("Failed to fetch favorites", err);
                const sawedwishlist = localStorage.getItem("user_wishlist");
                if (sawedwishlist) {
                    setWishlist(JSON.parse(sawedwishlist));
                }
            }).finally(() => {
                setIsloading(false);
            });
        } else {
            const sawedwishlist = localStorage.getItem("user_wishlist")
            if (sawedwishlist) {
                setWishlist(JSON.parse(sawedwishlist))
            }
            setIsloading(false)
        }
    }, [])

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("user_wishlist", JSON.stringify(wishlist))
        }
    }, [wishlist, isLoading])

    const toogletitem = async (product) => {
        setWishlist((prevlist) => {
            const exist = prevlist.find((item) => item.id === product.id)
            if (exist) {
                return prevlist.filter((item) => item.id !== product.id)
            } else {
                return [...prevlist, product]
            }
        });

        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                await api.post('favorites/toggle/', { product_id: product.id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Failed to toggle favorite on backend", err);
            }
        }
    }

    return (
        <WishlistContex.Provider value={{wishlist, toogletitem, isLoading}}>
            {children}
        </WishlistContex.Provider>
    )
}

export const useWishlist = () => useContext(WishlistContex)