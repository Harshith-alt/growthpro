import React, { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Business name required";
    if (!location.trim()) newErrors.location = "Location required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchBusinessData = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/business-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, location }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch business data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const regenerateHeadline = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/regenerate-headline?name=${encodeURIComponent(
          name
        )}&location=${encodeURIComponent(location)}`
      );
      if (!res.ok) throw new Error("Failed to regenerate headline");
      const result = await res.json();
      setData((prev) => ({ ...prev, headline: result.headline }));
    } catch (error) {
      console.error("Error regenerating headline:", error);
      setError("Failed to regenerate headline. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Local Business Dashboard
        </h1>

        <form onSubmit={fetchBusinessData} className="w-full">
          <div className="mb-4">
            <label
              htmlFor="business-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Business Name
            </label>
            <input
              id="business-name"
              type="text"
              placeholder="e.g. Cake & Co"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g. Mumbai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              "Get Business Data"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">
              Business Information
            </h2>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Name:</span> {data.name}
              </p>
              <p>
                <span className="font-medium">Location:</span> {data.location}
              </p>
              <p>
                <span className="font-medium">Rating:</span>{" "}
                <span className="text-yellow-600">{data.rating} ★</span>
              </p>
              <p>
                <span className="font-medium">Reviews:</span> {data.reviews}
              </p>
            </div>

            <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="font-medium text-blue-800">SEO Headline</p>
              <p className="mt-1 italic text-gray-700 transition-opacity duration-300">
                "{data.headline}"
              </p>
            </div>

            <button
              onClick={regenerateHeadline}
              className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Generate New Headline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
