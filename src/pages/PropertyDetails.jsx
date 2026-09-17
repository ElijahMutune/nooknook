import { useState } from "react";
import { useParams, Link } from "react-router-dom";

function PropertyDetails() {
  const { id } = useParams();

  /*
   * TEMPORARY PROPERTY DATA
   *
   * Later this will come from the backend API.
   */

  const properties = [
    {
      id: 1,
      name: "Modern Bedsitter",
      category: "Bedsitter",
      location: "Town Centre",
      price: 8500,
      availability: "Vacant",

      description:
          "Clean and spacious bedsitter located in a convenient area close to shops, public transport and other important facilities.",

      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
        "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8"
      ],

      amenities: [
        "Water available",
        "Electricity",
        "Parking",
        "Security",
        "Nearby shops",
        "Public transport"
      ],

      /*
       * Information that will eventually
       * be restricted to premium users.
       */

      premiumInformation: {
        exactLocation:
            "Near Town Centre Main Stage, approximately 200 metres from the main road.",

        landlord:
            "Property owner / landlord information",

        contact:
            "+254 7XX XXX XXX",

        security:
            "Secure compound with controlled entrance.",

        directions:
            "Detailed directions from the main stage to the property.",

        nearbyFacilities: [
          "Supermarket",
          "Hospital",
          "Market",
          "Public transport"
        ]
      }
    },

    {
      id: 2,
      name: "Spacious One Bedroom",
      category: "1 Bedroom",
      location: "Area A",
      price: 14000,
      availability: "Vacant",

      description:
          "A comfortable one bedroom house located in a quiet and secure neighbourhood.",

      images: [
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        "https://images.unsplash.com/photo-1560185008-b033106af5c3",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
      ],

      amenities: [
        "Water available",
        "Electricity",
        "Parking",
        "Security",
        "Spacious kitchen"
      ],

      premiumInformation: {
        exactLocation:
            "Detailed location information will be shown to premium users.",

        landlord:
            "Property owner / landlord information",

        contact:
            "+254 7XX XXX XXX",

        security:
            "Detailed security information.",

        directions:
            "Detailed directions to the property.",

        nearbyFacilities: [
          "Shopping centre",
          "Hospital",
          "Public transport"
        ]
      }
    },

    {
      id: 3,
      name: "Family Two Bedroom",
      category: "2 Bedroom",
      location: "Area B",
      price: 22000,
      availability: "Vacant",

      description:
          "Spacious two bedroom home suitable for a small family.",

      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
      ],

      amenities: [
        "Water available",
        "Electricity",
        "Parking",
        "Security",
        "Large living room",
        "Spacious compound"
      ],

      premiumInformation: {
        exactLocation:
            "Detailed location information will be shown to premium users.",

        landlord:
            "Property owner / landlord information",

        contact:
            "+254 7XX XXX XXX",

        security:
            "Detailed security information.",

        directions:
            "Detailed directions to the property.",

        nearbyFacilities: [
          "Shopping centre",
          "School",
          "Hospital",
          "Public transport"
        ]
      }
    }
  ];

  const property = properties.find(
      (item) => item.id === Number(id)
  );

  const [currentImage, setCurrentImage] = useState(0);

  /*
   * Temporary user status.
   *
   * Later this will come from the logged-in
   * user's account returned by the backend.
   */
  const isPremiumUser = false;

  if (!property) {
    return (
        <div className="property-not-found">

          <h2>Property Not Found</h2>

          <p>
            The property you are looking for does not exist.
          </p>

          <Link to="/">
            ← Back to Home
          </Link>

        </div>
    );
  }

  const nextImage = () => {
    setCurrentImage((prev) =>
        prev === property.images.length - 1
            ? 0
            : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImage((prev) =>
        prev === 0
            ? property.images.length - 1
            : prev - 1
    );
  };

  return (
      <div className="property-details-page">

        {/* =========================================
          BACK TO HOME
      ========================================= */}

        <div className="details-container">

          <Link
              to="/"
              className="back-home"
          >
            ← Back to properties
          </Link>


          {/* =========================================
            IMAGE GALLERY
        ========================================= */}

          <div className="details-gallery">

            <div className="main-property-image">

              <img
                  src={property.images[currentImage]}
                  alt={property.name}
              />

              {property.images.length > 1 && (
                  <>
                    <button
                        className="details-slider-button details-prev"
                        onClick={previousImage}
                    >
                      ‹
                    </button>

                    <button
                        className="details-slider-button details-next"
                        onClick={nextImage}
                    >
                      ›
                    </button>
                  </>
              )}

            </div>


            {/* Thumbnails */}

            <div className="property-thumbnails">

              {property.images.map((image, index) => (
                  <button
                      key={index}
                      className={
                        index === currentImage
                            ? "thumbnail active"
                            : "thumbnail"
                      }
                      onClick={() => setCurrentImage(index)}
                  >
                    <img
                        src={image}
                        alt={`${property.name} ${index + 1}`}
                    />
                  </button>
              ))}

            </div>

          </div>


          {/* =========================================
            PROPERTY HEADER
        ========================================= */}

          <div className="property-details-header">

            <div>

            <span className="details-category">
              {property.category}
            </span>

              <h1>{property.name}</h1>

              <p className="details-location">
                📍 {property.location}
              </p>

            </div>

            <div className="details-price">

              <strong>
                KSh {property.price.toLocaleString()}
              </strong>

              <span>per month</span>

            </div>

          </div>


          {/* =========================================
            AVAILABILITY
        ========================================= */}

          <div className="availability-box">

          <span>
            Availability
          </span>

            <strong
                className={
                  property.availability === "Vacant"
                      ? "vacant"
                      : "occupied"
                }
            >
              {property.availability}
            </strong>

          </div>


          {/* =========================================
            DESCRIPTION
        ========================================= */}

          <section className="details-section">

            <h2>About this property</h2>

            <p>
              {property.description}
            </p>

          </section>


          {/* =========================================
            AMENITIES
        ========================================= */}

          <section className="details-section">

            <h2>Amenities</h2>

            <div className="amenities-grid">

              {property.amenities.map(
                  (amenity, index) => (
                      <div
                          key={index}
                          className="amenity-item"
                      >
                        ✓ {amenity}
                      </div>
                  )
              )}

            </div>

          </section>


          {/* =========================================
            PREMIUM INFORMATION
        ========================================= */}

          <section className="premium-information">

            <div className="premium-header">

              <div>

              <span className="premium-label">
                PREMIUM
              </span>

                <h2>
                  More information about this property
                </h2>

              </div>

            </div>


            {isPremiumUser ? (

                <div className="premium-content">

                  <div>
                    <strong>Exact Location</strong>
                    <p>
                      {property.premiumInformation.exactLocation}
                    </p>
                  </div>

                  <div>
                    <strong>Landlord</strong>
                    <p>
                      {property.premiumInformation.landlord}
                    </p>
                  </div>

                  <div>
                    <strong>Contact</strong>
                    <p>
                      {property.premiumInformation.contact}
                    </p>
                  </div>

                  <div>
                    <strong>Security</strong>
                    <p>
                      {property.premiumInformation.security}
                    </p>
                  </div>

                  <div>
                    <strong>Directions</strong>
                    <p>
                      {property.premiumInformation.directions}
                    </p>
                  </div>

                  <div>
                    <strong>Nearby Facilities</strong>

                    <ul>
                      {property.premiumInformation.nearbyFacilities.map(
                          (facility, index) => (
                              <li key={index}>
                                {facility}
                              </li>
                          )
                      )}
                    </ul>

                  </div>

                </div>

            ) : (

                <div className="premium-locked">

                  <div className="lock-icon">
                    🔒
                  </div>

                  <h3>
                    Premium information
                  </h3>

                  <p>
                    Become a premium user to access
                    the full property information,
                    including detailed location,
                    landlord contact, directions,
                    security information and more.
                  </p>

                  <Link
                      to="/premium"
                      className="premium-button"
                  >
                    Become a Premium User
                  </Link>

                </div>

            )}

          </section>

        </div>

      </div>
  );
}

export default PropertyDetails;