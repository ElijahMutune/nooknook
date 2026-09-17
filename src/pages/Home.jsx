import { useState } from "react";
import Navbar from "../components/Navbar";
import PlaceNav from "../components/PlaceNav";
import PropertyCard from "../components/PropertyCard";

function Home() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Temporary data for testing.
  // Later this will come from the backend/database.
  const places = [
    {
      id: 1,
      name: "Town Centre",
      categories: [
        { id: 1, name: "Single Room" },
        { id: 2, name: "Bedsitter" },
        { id: 3, name: "1 Bedroom" },
        { id: 4, name: "2 Bedroom" },
        { id: 5, name: "Hostel" },
        { id: 6, name: "Guest Room" },
      ],
    },
    {
      id: 2,
      name: "Area A",
      categories: [
        { id: 7, name: "Single Room" },
        { id: 8, name: "Bedsitter" },
        { id: 9, name: "1 Bedroom" },
        { id: 10, name: "Guest Room" },
      ],
    },
    {
      id: 3,
      name: "Area B",
      categories: [
        { id: 11, name: "Bedsitter" },
        { id: 12, name: "2 Bedroom" },
        { id: 13, name: "Hostel" },
      ],
    },
    {
      id: 4,
      name: "Area C",
      categories: [
        { id: 14, name: "Single Room" },
        { id: 15, name: "1 Bedroom" },
        { id: 16, name: "Guest Room" },
      ],
    },
    {
      id: 5,
      name: "Area D",
      categories: [
        { id: 17, name: "Bedsitter" },
        { id: 18, name: "1 Bedroom" },
        { id: 19, name: "2 Bedroom" },
      ],
    },
  ];

  // Temporary properties for testing the cards.
  const properties = [
    {
      id: 1,
      name: "Modern Bedsitter",
      category: "Bedsitter",
      placeId: 1,
      location: "Town Centre",
      price: 8500,
      description: "Clean and spacious bedsitter close to shops and public transport.",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1560185008-b033106af5c3",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      ],
    },

    {
      id: 2,
      name: "Spacious 1 Bedroom",
      category: "1 Bedroom",
      placeId: 1,
      location: "Town Centre",
      price: 14000,
      description: "Spacious one-bedroom house with a modern kitchen and secure compound.",
      images: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
        "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
        "https://images.unsplash.com/photo-1617104678098-de229db51175",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
      ],
    },

    {
      id: 3,
      name: "Affordable Single Room",
      category: "Single Room",
      placeId: 2,
      location: "Area A",
      price: 5000,
      description: "Affordable single room in a convenient and quiet neighbourhood.",
      images: [
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
      ],
    },

    {
      id: 4,
      name: "Executive Bedsitter",
      category: "Bedsitter",
      placeId: 2,
      location: "Area A",
      price: 10000,
      description: "Modern executive bedsitter with good lighting and a secure compound.",
      images: [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      ],
    },

    {
      id: 5,
      name: "Two Bedroom Family House",
      category: "2 Bedroom",
      placeId: 3,
      location: "Area B",
      price: 22000,
      description: "Comfortable two-bedroom house suitable for a small family.",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
        "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90",
      ],
    },

    {
      id: 6,
      name: "Student Hostel Room",
      category: "Hostel",
      placeId: 3,
      location: "Area B",
      price: 6500,
      description: "Affordable hostel room located close to learning institutions.",
      images: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      ],
    },

    {
      id: 7,
      name: "Comfortable Guest Room",
      category: "Guest Room",
      placeId: 4,
      location: "Area C",
      price: 2500,
      description: "Comfortable guest room suitable for short stays.",
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
      ],
    },

    {
      id: 8,
      name: "Modern Two Bedroom",
      category: "2 Bedroom",
      placeId: 5,
      location: "Area D",
      price: 20000,
      description: "Modern two-bedroom house with spacious rooms and parking.",
      images: [
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      ],
    },
  ];

  // Select a place or a specific category.
  const handlePlaceSelect = (place, category = null) => {
    setSelectedPlace(place);
    setSelectedCategory(category);
  };

  // Filter properties according to the selected place/category.
  const filteredProperties = properties.filter((property) => {
    if (selectedPlace && property.placeId !== selectedPlace.id) {
      return false;
    }

    if (
      selectedCategory &&
      property.category !== selectedCategory.name
    ) {
      return false;
    }

    return true;
  });

  return (
    <div>
      {/* Existing top navigation */}
      <Navbar />

      {/* Second navigation */}
      <PlaceNav
        places={places}
        onSelect={handlePlaceSelect}
      />

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

            {selectedPlace && (
              <div className="selection-display">
                <span>{selectedPlace.name}</span>

                {selectedCategory && (
                  <>
                    <span>›</span>
                    <span>{selectedCategory.name}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="properties-section">
        <div className="section-heading">
          <div>
            <h2>Available Properties</h2>

            <p>
              {selectedPlace
                ? selectedCategory
                  ? `Available ${selectedCategory.name} properties in ${selectedPlace.name}`
                  : `Available properties in ${selectedPlace.name}`
                : "Find available houses and rooms around town."}
            </p>
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="property-grid">
            {filteredProperties.map((property) => (
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