export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-12 h-12 sm:w-16 sm:h-16">
        
        {/* Soft Glow Background */}
        <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-xl"></div>

        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>

        {/* Animated Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 border-r-teal-400 animate-spin"></div>

        
      </div>
    </div>
  );
}
