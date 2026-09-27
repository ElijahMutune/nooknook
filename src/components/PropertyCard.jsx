import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PropertyCard.css";

function PropertyCard({ property }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

    const images = (property.images || [])
        .map((image) => {
            let imageUrl = "";

            if (typeof image === "string") {
                imageUrl = image;
            } else {
                imageUrl =
                    image.image_url ||
                    image.url ||
                    image.imageUrl ||
                    image.path ||
                    image.filename ||
                    "";
            }

            // Convert backend relative URL to full URL
            if (imageUrl.startsWith("/")) {
                return `http://localhost:5000${imageUrl}`;
            }

            return imageUrl;
        })
        .filter(Boolean);
    console.log("PROPERTY:", property);
    console.log("IMAGES:", images);

  /* =========================================
     NEXT IMAGE
  ========================================= */

  const nextImage = () => {
    if (images.length === 0) return;

    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };


  /* =========================================
     PREVIOUS IMAGE
  ========================================= */

  const previousImage = () => {
    if (images.length === 0) return;

    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };


  /* =========================================
     AUTOMATIC SLIDER
  ========================================= */

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length, isHovered]);


  /* =========================================
     NO IMAGES
  ========================================= */

  if (images.length === 0) {
    return (
      <div className="property-card">

        <div className="property-image no-image">
          <span>No image available</span>
        </div>

        <div className="property-content">
          <h3>{property.name}</h3>

          <p className="location">
            📍 {property.location}
          </p>
        </div>

      </div>
    );
  }


  return (
    <div
      className="property-card"

      onMouseEnter={() => setIsHovered(true)}

      onMouseLeave={() => setIsHovered(false)}
    >

      {/* =========================================
          IMAGE SLIDER
      ========================================= */}

      <div className="property-image">

        <img
            src={images[currentImage]}
            alt={property.name}
            className="property-slider-image"
            onLoad={() => {
              console.log("IMAGE LOADED:", images[currentImage]);
            }}
            onError={(e) => {
              console.error("IMAGE FAILED:", images[currentImage]);
              console.error("Full image element:", e.currentTarget);
            }}
        />


        {/* Previous button */}

        {images.length > 1 && (
            <button
                className="slider-button slider-prev"
                onClick={previousImage}
                aria-label="Previous image"
            >
              ‹
            </button>
        )}


        {/* Next button */}

        {images.length > 1 && (
            <button
                className="slider-button slider-next"
                onClick={nextImage}
                aria-label="Next image"
            >
              ›
            </button>
        )}


        {/* Image dots */}

        {images.length > 1 && (
            <div className="slider-dots">

              {images.map((_, index) => (
                  <button
                      key={index}
                      className={
                        index === currentImage
                            ? "slider-dot active"
                            : "slider-dot"
                      }
                      onClick={() => setCurrentImage(index)}
                      aria-label={`View image ${index + 1}`}
                  />
              ))}

            </div>
        )}

      </div>


      {/* =========================================
          PROPERTY INFORMATION
      ========================================= */}

      <div className="property-content">

        <span className="property-category">
          {property.category}
        </span>


        <h3>
          {property.name}
        </h3>


        <p className="location">
          📍 {property.location}
        </p>


        <p className="description">
          {property.description}
        </p>


        <div className="property-bottom">

          <strong>
            KSh {property.price?.toLocaleString()}
          </strong>


          <Link to={`/property/${property.id}`}>
            View Details →
          </Link>

        </div>

      </div>

    </div>
  );
}

export default PropertyCard;