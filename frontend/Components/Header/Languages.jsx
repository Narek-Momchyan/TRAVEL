'use client'
import{ useState } from 'react'
import style from './header.module.css'
import { FaGlobe } from "react-icons/fa"

export default function Languages({ languages }) {
    const onchange = (code) => {
        const date = new Date()
        date.setFullYear(date.getFullYear() + 10)
        document.cookie = `lang=${code}; path=/;expires=${date.toUTCString()}`
        window.location.reload()
    }
    const [drop, setDrop] = useState(false)
    return (
        <div className={style.drop_btn}>

            <FaGlobe className={style.globus}  onClick={()=>setDrop(!drop)} />
            
           {drop && (
            <div className={style.drop_content}>
                {
                    languages?.map(item => (
                        <p 
                            onClick={() => onchange(item.code)}
                            key={item.id} className={style.leng}>{item.code}</p>
                    ))
                }
            </div>
           )}
        </div>
    )
}