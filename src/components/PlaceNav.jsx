import { useState } from "react";

function PlaceNav({ places, onSelect }) {
    const [activePlace, setActivePlace] = useState(null);

    return (
        <div className="places-wrapper">
            <div className="places-nav">

                {places.map((place) => (
                    <div
                        key={place.id}
                        className="place-item"
                        onMouseEnter={() => setActivePlace(place.id)}
                        onMouseLeave={() => setActivePlace(null)}
                    >

                        <button
                            className="place-button"
                            onClick={() => onSelect(place)}
                        >
                            {place.name}
                        </button>

                        <div
                            className={`house-dropdown ${
                                activePlace === place.id ? "show" : ""
                            }`}
                        >
                            {place.categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onSelect(place, category);
                                        setActivePlace(null);
                                    }}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
}

export default PlaceNav;