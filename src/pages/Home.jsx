import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PlaceNav from "../components/PlaceNav";
import PropertyCard from "../components/PropertyCard";

function Home() {
  const [searchParams] = useSearchParams();

  const placeId = searchParams.get("placeId");
  const categoryId = searchParams.get("categoryId");

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load properties from the backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const SERVER_URL = `${process.env.REACT_APP_API_URL}/properties`;

        const params = new URLSearchParams();

        if (placeId) {
          params.append("placeId", placeId);
        }

        if (categoryId) {
          params.append("categoryId", categoryId);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load properties"
          );
        }

        setProperties(data.properties || []);
      } catch (err) {
        console.error("Property loading error:", err);
        setError("Failed to load properties.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [placeId, categoryId]);

  return (
    <div>
      {/* Existing top navigation */}
      <Navbar />

      {/* Database-driven second navigation */}
      <PlaceNav />

      {/* Hero section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Find Your Next Home</h1>

            <p>
              Find a place that feels like home.
            </p>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search properties..."
              />

              <button type="button">
                🔍 Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="properties-section">
        <div className="section-heading">
          <div>
            <h2>Available Properties</h2>

            <p>
              {placeId && categoryId
                ? "Properties matching your selection."
                : placeId
                ? "Available properties in this place."
                : "Find available houses and rooms around town."}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="no-properties">
            <h3>Loading properties...</h3>
            <p>Please wait while we find available properties.</p>
          </div>
        ) : error ? (
          <div className="no-properties">
            <h3>Unable to load properties</h3>
            <p>{error}</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="property-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        ) : (
          <div className="no-properties">
            <h3>No properties found</h3>

            <p>
              There are currently no properties matching
              your selection.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;