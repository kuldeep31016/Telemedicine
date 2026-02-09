import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const SearchBar = ({ onSearch, searchQuery, onOpenFilters, filterCount = 0 }) => {
    return (
        <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search doctors by name, specialty, or hospital..."
                    className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all"
                />
            </div>

            <button
                onClick={onOpenFilters}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all relative"
            >
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                Filters
                {filterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                        {filterCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default SearchBar;
