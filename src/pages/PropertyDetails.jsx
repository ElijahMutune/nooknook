import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./PropertyDetails.css";

const API_URL = process.env.REACT_APP_API_URL;
const SERVER_URL = process.env.REACT_APP_API_URL.replace("/api", "");

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const headers = {};

        if (token) {
          headers.Authorization =
              `Bearer ${token}`;
        }

        const response = await fetch(
            `${API_URL}/properties/${id}`,
            {
              headers
            }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
              data.message ||
              "Failed to load property"
          );
        }

        if (!data.success) {
          throw new Error(
              data.message ||
              "Failed to load property"
          );
        }

        console.log(
            "Property details from backend:",
            data
        );

        setProperty(data.property);
      } catch (err) {
        console.error(
            "Property details error:",
            err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${SERVER_URL}${imageUrl}`;
  };

  const getImages = () => {
    if (!property?.images) {
      return [];
    }

    return property.images
        .map((image) => {
          const imageUrl =
              typeof image === "string"
                  ? image
                  : image.image_url ||
                  image.url ||
                  image.imageUrl ||
                  image.path ||
                  image.filename ||
                  "";

          return getImageUrl(imageUrl);
        })
        .filter(Boolean);
  };

  const images = getImages();

  const nextImage = () => {
    if (images.length === 0) {
      return;
    }

    setCurrentImage((prev) =>
        prev === images.length - 1
            ? 0
            : prev + 1
    );
  };

  const previousImage = () => {
    if (images.length === 0) {
      return;
    }

    setCurrentImage((prev) =>
        prev === 0
            ? images.length - 1
            : prev - 1
    );
  };

  if (loading) {
    return (
        <div className="property-details-page">
          <div className="property-details-loading">
            Loading property...
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="property-details-page">
          <div className="property-details-error">
            <h2>
              Unable to load property
            </h2>

            <p>{error}</p>

            <Link to="/">
              ← Back to Home
            </Link>
          </div>
        </div>
    );
  }

  if (!property) {
    return (
        <div className="property-details-page">
          <div className="property-details-error">
            <h2>
              Property not found
            </h2>

            <Link to="/">
              ← Back to Home
            </Link>
          </div>
        </div>
    );
  }

  const price = Number(property.price);

  return (
      <div className="property-details-page">

        <div className="property-details-container">

          <Link
              to="/"
              className="back-home"
          >
            ← Back to Home
          </Link>

          <div className="property-details-card">

            {/* IMAGES */}

            <div className="details-gallery">

              {images.length > 0 ? (
                  <>
                    <div className="main-property-image">

                      <img
                          src={
                            images[
                                currentImage
                                ]
                          }
                          alt={
                            property.name
                          }
                          onError={(e) => {
                            console.error(
                                "Image failed:",
                                e.target.src
                            );
                          }}
                      />

                      {images.length >
                          1 && (
                              <>
                                <button
                                    type="button"
                                    className="details-slider-button previous"
                                    onClick={
                                      previousImage
                                    }
                                >
                                  ‹
                                </button>

                                <button
                                    type="button"
                                    className="details-slider-button next"
                                    onClick={
                                      nextImage
                                    }
                                >
                                  ›
                                </button>
                              </>
                          )}
                    </div>

                    {images.length >
                        1 && (
                            <div className="details-thumbnails">

                              {images.map(
                                  (
                                      image,
                                      index
                                  ) => (
                                      <button
                                          type="button"
                                          key={
                                              image +
                                              index
                                          }
                                          className={
                                            index ===
                                            currentImage
                                                ? "thumbnail active"
                                                : "thumbnail"
                                          }
                                          onClick={() =>
                                              setCurrentImage(
                                                  index
                                              )
                                          }
                                      >
                                        <img
                                            src={
                                              image
                                            }
                                            alt={`Property ${
                                                index +
                                                1
                                            }`}
                                        />
                                      </button>
                                  )
                              )}
                            </div>
                        )}
                  </>
              ) : (
                  <div className="no-property-image">
                    No images available
                  </div>
              )}

            </div>

            {/* PROPERTY INFORMATION */}

            <div className="property-details-content">

                        <span className="details-category">
                            {property.category_name ||
                                "Property"}
                        </span>

              <h1>
                {property.name}
              </h1>

              <p className="details-location">
                📍{" "}
                {property.location ||
                    property.place_name ||
                    "Location not specified"}
              </p>

              <div className="details-price">
                KSh{" "}
                {price.toLocaleString()}
                <span>
                                {" "}
                  /{" "}
                  {property.billing_period ||
                      "month"}
                            </span>
              </div>

              <div className="property-basic-info">

                <div>
                  <strong>
                    Place
                  </strong>
                  <span>
                                    {property.place_name ||
                                        "Not specified"}
                                </span>
                </div>

                <div>
                  <strong>
                    Type
                  </strong>
                  <span>
                                    {property.category_name ||
                                        "Not specified"}
                                </span>
                </div>

                <div>
                  <strong>
                    Bedrooms
                  </strong>
                  <span>
                                    {property.bedrooms ??
                                        0}
                                </span>
                </div>

                <div>
                  <strong>
                    Bathrooms
                  </strong>
                  <span>
                                    {property.bathrooms ??
                                        0}
                                </span>
                </div>

              </div>

              {/* DESCRIPTION */}

              <section className="details-section">

                <h2>
                  About this property
                </h2>

                <p>
                  {property.description ||
                      "No description available."}
                </p>

              </section>

              {/* AMENITIES */}

              {property.amenities &&
                  property.amenities.length >
                  0 && (
                      <section className="details-section">

                        <h2>
                          Amenities
                        </h2>

                        <div className="amenities-list">

                          {property.amenities.map(
                              (
                                  amenity
                              ) => (
                                  <span
                                      key={
                                        amenity.id
                                      }
                                  >
                                                    ✓{" "}
                                    {
                                      amenity.name
                                    }
                                                </span>
                              )
                          )}

                        </div>

                      </section>
                  )}

              {/* ACCESS STATUS */}

              <div className="property-access-box">

                {property.premium_information ? (
                    <div>
                      <strong>
                        ⭐ Premium
                        information
                      </strong>

                      <p>
                        You have access
                        to additional
                        property
                        information.
                      </p>
                    </div>
                ) : (
                    <div>
                      <strong>
                        Property
                        information
                      </strong>

                      <p>
                        More detailed
                        information may
                        be available to
                        premium users.
                      </p>
                    </div>
                )}

              </div>

              {/* PREMIUM INFORMATION */}

              {property.premium_information && (
                  <section className="premium-details">

                    <h2>
                      ⭐ Premium Property
                      Information
                    </h2>

                    {property
                        .premium_information
                        .exact_location && (
                        <div>
                          <strong>
                            Exact
                            Location
                          </strong>
                          <p>
                            {
                              property
                                  .premium_information
                                  .exact_location
                            }
                          </p>
                        </div>
                    )}

                    {property
                        .premium_information
                        .full_description && (
                        <div>
                          <strong>
                            Full
                            Description
                          </strong>
                          <p>
                            {
                              property
                                  .premium_information
                                  .full_description
                            }
                          </p>
                        </div>
                    )}

                    {property
                        .premium_information
                        .landlord_name && (
                        <div>
                          <strong>
                            Landlord
                          </strong>
                          <p>
                            {
                              property
                                  .premium_information
                                  .landlord_name
                            }
                          </p>
                        </div>
                    )}

                    {property
                        .premium_information
                        .landlord_phone && (
                        <div>
                          <strong>
                            Phone
                          </strong>
                          <p>
                            {
                              property
                                  .premium_information
                                  .landlord_phone
                            }
                          </p>
                        </div>
                    )}

                    {property
                        .premium_information
                        .landlord_email && (
                        <div>
                          <strong>
                            Email
                          </strong>
                          <p>
                            {
                              property
                                  .premium_information
                                  .landlord_email
                            }
                          </p>
                        </div>
                    )}

                    {property
                        .premium_information
                        .directions && (
                        <div>
                          <strong>
                            Directions
                          </strong>
                          <p>
                            {
                              property
                                  .premium_information
                                  .directions
                            }
                          </p>
                        </div>
                    )}

                    {property
                        .premium_information
                        .security_details && (
                        <div>
                          <strong>
                            Security
                          </strong>
                          <p>
                            {
                              property
                                  .premium_information
                                  .security_details
                            }
                          </p>
                        </div>
                    )}

                    {property
                        .premium_information
                        .parking_details && (
                        <div>
                          <strong>
                            Parking
                          </strong>
                          <p>
                            {
                              property
                                  .premium_information
                                  .parking_details
                            }
                          </p>
                        </div>
                    )}

                    {property
                        .premium_information
                        .nearby_facilities && (
                        <div>
                          <strong>
                            Nearby
                            Facilities
                          </strong>
                          <p>
                            {
                              property
                                  .premium_information
                                  .nearby_facilities
                            }
                          </p>
                        </div>
                    )}

                    {property
                        .premium_information
                        .house_rules && (
                        <div>
                          <strong>
                            House Rules
                          </strong>
                          <p>
                            {
                              property
                                  .premium_information
                                  .house_rules
                            }
                          </p>
                        </div>
                    )}

                    {property
                        .premium_information
                        .additional_information && (
                        <div>
                          <strong>
                            Additional
                            Information
                          </strong>
                          <p>
                            {
                              property
                                  .premium_information
                                  .additional_information
                            }
                          </p>
                        </div>
                    )}

                  </section>
              )}

            </div>

          </div>

        </div>

      </div>
  );
}

export default PropertyDetails;