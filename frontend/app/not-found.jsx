import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans px-4 text-center">
      <h1 className="text-6xl md:text-8xl font-bold text-[#1a859c] mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Sorry, the page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      
      <Link 
        href="/"
        className="px-6 py-3 bg-[#1a859c] text-white rounded-xl font-medium shadow-md hover:bg-[#136b7d] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        Back to Home
      </Link>
    </div>
  );
}
