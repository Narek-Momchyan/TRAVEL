import api from '@/lib/api';
import { getLanguage } from '@/lib/lang';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaTelegramPlane, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

export default async function Footer() {
  const lang = await getLanguage();
  let footerData = null;
  
  try {
    const res = await api.get(`footer/?lang=${lang}`);
    footerData = res.data?.length > 0 ? res.data[0] : null;
  } catch (error) {
    console.error("Error fetching footer data:", error);
  }

  if (!footerData) return null;

  return (
    <footer className="bg-[#3597ad] text-white pt-8 pb-4 font-sans">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">
          
          <div className="flex-shrink-0">
            {footerData.logo && (
              <img 
                src={footerData.logo} 
                alt="Footer Logo" 
                className="h-20 w-auto object-contain"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            {footerData.facebook_url && (
              <Link href={footerData.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#3597ad] hover:scale-110 shadow transition-transform">
                <FaFacebookF size={16} />
              </Link>
            )}
            {footerData.twitter_url && (
              <Link href={footerData.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#3597ad] hover:scale-110 shadow transition-transform">
                <FaTwitter size={16} />
              </Link>
            )}
            {footerData.instagram_url && (
              <Link href={footerData.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white hover:scale-110 shadow transition-transform">
                <FaInstagram size={16} />
              </Link>
            )}
            {footerData.linkedin_url && (
              <Link href={footerData.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded bg-white text-[#3597ad] hover:scale-110 shadow transition-transform">
                <FaLinkedinIn size={16} />
              </Link>
            )}
            {footerData.telegram_url && (
              <Link href={footerData.telegram_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#3597ad] hover:scale-110 shadow transition-transform">
                <FaTelegramPlane size={16} />
              </Link>
            )}
          </div>

          <div className="flex flex-col items-center md:items-start space-y-3 text-sm">
            {footerData.phone_number && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/80">
                  <FaPhoneAlt size={12} className="text-white" />
                </div>
                <span className="font-medium tracking-wide">{footerData.phone_number}</span>
              </div>
            )}
            {footerData.address && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/80">
                  <FaMapMarkerAlt size={12} className="text-white" />
                </div>
                <span className="font-medium tracking-wide">{footerData.address}</span>
              </div>
            )}
          </div>
        </div>

        {footerData.copyright_text && (
          <div className="mt-8 pt-4 border-t border-white/30 text-center">
            <p className="text-xs text-white/90">
              {footerData.copyright_text}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
