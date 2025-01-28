import { Search, MapPin } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row items-center gap-2">
      <div className="flex-1 w-full flex items-center gap-2 p-2 border-b sm:border-b-0 sm:border-r border-gray-200">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Job title, keyword..."
          className="w-full outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
      <div className="flex-1 w-full flex items-center gap-2 p-2">
        <MapPin className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Your location"
          className="w-full outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
      <button className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium">
        Find Job
      </button>
    </div>
  );
};

export default SearchBar;