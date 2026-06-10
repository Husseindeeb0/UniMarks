import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm transition-all duration-300">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
      <p className="text-sm font-medium text-gray-500">Loading...</p>
    </div>
  );
};

export default Loader;