import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceNav.css";

const API_URL = process.env.REACT_APP_API_URL;

function PlaceNav() {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState({});
  const [activePlace, setActivePlace] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =========================================
  // LOAD PLACES
  // =========================================

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(`${API_URL}/places`);
const data = await response.json();

console.log("Places:", data);

if (data.success) {
    setPlaces(data.places || []);
}
} catch (error) {
    console.error("Failed to load places:", error);
}
};

fetchPlaces();
}, []);

// =========================================
// LOAD CATEGORIES
// =========================================

const handlePlaceEnter = async (placeId) => {
    setActivePlace(placeId);

    // Already loaded
    if (categories[placeId]) {
        return;
    }

    try {
        setLoading(true);

        const response = await fetch(
            `${API_URL}/place-categories/place/${placeId}`
        );

        const data = await response.json();

        console.log(
            `Categories for place ${placeId}:`,
            data
        );

        if (data.success) {
            setCategories((prev) => ({
                ...prev,
                [placeId]: data.categories || [],
            }));
        }
    } catch (error) {
        console.error(
            "Failed to load categories:",
            error
        );

        setCategories((prev) => ({
            ...prev,
            [placeId]: [],
        }));
    } finally {
        setLoading(false);
    }
};

// =========================================
// CATEGORY CLICK
// =========================================

const handleCategoryClick = (
    placeId,
    categoryId
) => {
    navigate(
        `/?placeId=${placeId}&categoryId=${categoryId}`
    );

    setActivePlace(null);
};

// =========================================
// RENDER
// =========================================

return (
    <div className="place-nav-wrapper">
        <div className="place-nav">

            {places.map((place) => (
                <div
                    key={place.id}
                    className="place-nav-item"

                    onMouseEnter={() =>
                        handlePlaceEnter(place.id)
                    }

                    onMouseLeave={() =>
                        setActivePlace(null)
                    }
                >

                    <button
                        type="button"
                        className="place-button"
                    >
                        {place.name}

                        <span className="place-arrow">
                ▾
              </span>
                    </button>

                    {/* =====================================
                DROPDOWN
            ===================================== */}

                    {activePlace === place.id && (
                        <div className="house-dropdown">

                            {loading &&
                            !categories[place.id] ? (
                                <div className="category-loading">
                                    Loading...
                                </div>
                            ) : categories[place.id] &&
                            categories[place.id].length > 0 ? (

                                categories[place.id].map(
                                    (category) => (
                                        <button
                                            key={category.id}
                                            type="button"
                                            className="house-dropdown-item"

                                            onClick={() =>
                                                handleCategoryClick(
                                                    place.id,
                                                    category.id
                                                )
                                            }
                                        >
                                            {category.name}
                                        </button>
                                    )
                                )

                            ) : (

                                <div className="no-categories">
                                    No property types available
                                </div>

                            )}

                        </div>
                    )}

                </div>
            ))}

        </div>
    </div>
);
}

export default PlaceNav;