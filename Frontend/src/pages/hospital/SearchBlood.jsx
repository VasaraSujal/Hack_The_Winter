import { useState } from "react";
import { searchBloodAvailability } from "../../services/hospitalApi";
import { toast } from "react-hot-toast";

export default function SearchBlood() {
  const [filters, setFilters] = useState({
    bloodType: "O+",
    minUnits: 1,
    city: ""
  });
  const [source, setSource] = useState('bloodbank');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    
    try {
      const response = await searchBloodAvailability(
        filters.bloodType, 
        filters.minUnits, 
        filters.city
      );
      
      if (response.data.success) {
        setResults(response.data.data);
        setSource(response.data.source || 'bloodbank');
        if (response.data.data.length === 0) {
          toast.success("No stock matching your criteria");
        } else if (response.data.source === 'donor') {
           toast.success(`No stock found. Found ${response.data.data.length} potential donors.`);
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Failed to search blood availability");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* ... Header & Form ... */}
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-widest text-red-700 font-bold">
          Emergency
        </p>
        <h2 className="text-3xl font-bold text-gray-900">
          Search Blood Stock
        </h2>
        <p className="text-sm text-gray-600">
          Find available blood units or compatible donors instantly.
        </p>
      </div>

      {/* Search Filter Box */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
        <form onSubmit={handleSearch} className="grid gap-6 md:grid-cols-4 items-end">
          {/* ... Inputs ... */}
          
          {/* Blood Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Blood Type</label>
            <select
              value={filters.bloodType}
              onChange={(e) => setFilters({...filters, bloodType: e.target.value})}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-semibold text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition"
            >
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Min Units - Only relevant for stock search, but we keep it */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Minimum Units</label>
            <input
              type="number"
              min="1"
              value={filters.minUnits}
              onChange={(e) => setFilters({...filters, minUnits: e.target.value})}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-semibold text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">City (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              value={filters.city}
              onChange={(e) => setFilters({...filters, city: e.target.value})}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-semibold text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-bold text-white shadow-lg hover:from-red-700 hover:to-red-800 hover:shadow-xl transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Find Blood"}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
               {source === 'donor' ? 'Matching Donors' : 'Search Results'} ({results.length})
            </h3>
            {source === 'donor' && results.length > 0 && (
               <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold border border-yellow-200">
                 Stock unavailable - Showing Donors
               </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center text-gray-500">
               {loading ? "Scanning network..." : "No stock or donors found."}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => (
                <div key={item._id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                  
                  {source === 'bloodbank' ? (
                     // === BLOOD BANK CARD ===
                     <>
                        <div className="absolute top-0 right-0 rounded-bl-xl bg-red-100 px-4 py-2 text-red-700 font-bold">
                            {item.bloodStock?.[filters.bloodType]?.units} Units
                        </div>

                        <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.type}</p>
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-red-700 transition">
                            {item.name}
                            </h4>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                            <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                            <p>{item.location?.address || "Address not available"}</p>
                            </div>
                            <div className="flex items-center gap-2">
                            <span className="block h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                            <p>{item.location?.city}, {item.location?.state}</p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-lg bg-red-50 p-4 border border-red-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-red-500 uppercase tracking-wide">Available Stock</p>
                                <p className="text-sm text-gray-600">for Blood Group <span className="font-bold text-gray-900">{filters.bloodType}</span></p>
                            </div>
                            <div className="flex flex-col items-center rounded-lg bg-white p-2 shadow-sm border border-red-100 min-w-[80px]">
                                <span className="text-2xl font-bold text-red-600">
                                    {item.bloodStock?.[filters.bloodType]?.units || 0}
                                </span>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase">Units</span>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4 flex items-center justify-between">
                            <div className="text-xs">
                                <p className="text-gray-500">Contact</p>
                                <p className="font-semibold text-gray-900">{item.phone}</p>
                            </div>
                            <button 
                                onClick={() => window.location.href = `tel:${item.phone}`}
                                className="rounded-full bg-gray-100 hover:bg-red-50 p-2 text-gray-600 hover:text-red-600 transition"
                            >
                            📞
                            </button>
                        </div>
                     </>
                  ) : (
                     // === DONOR CARD ===
                     <>
                        <div className="absolute top-0 right-0 rounded-bl-xl bg-blue-100 px-4 py-2 text-blue-700 font-bold">
                            Donor
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Donor</p>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition">
                            {item.name}
                            </h4>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600">
                             <div className="flex items-center gap-2">
                                <span className="text-gray-400">🩸</span>
                                <p className="font-bold text-gray-900">Blood Group: <span className="text-red-600 text-lg">{item.bloodGroup}</span></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">📍</span>
                                <p>{item.city}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">👤</span>
                                <p>{item.gender}, {item.age} years</p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-lg bg-blue-50 p-3 border border-blue-100">
                             <p className="text-xs text-blue-800 text-center">
                                This donor matches the required blood group.
                             </p>
                        </div>

                         <div className="mt-4 border-t border-gray-100 pt-4 flex items-center justify-between">
                            <div className="text-xs">
                                <p className="text-gray-500">Mobile</p>
                                <p className="font-semibold text-gray-900">{item.mobileNumber}</p>
                            </div>
                            <button 
                                onClick={() => window.location.href = `tel:${item.mobileNumber}`}
                                className="rounded-full bg-gray-100 hover:bg-blue-50 p-2 text-gray-600 hover:text-blue-600 transition"
                            >
                            📞
                            </button>
                        </div>
                     </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
