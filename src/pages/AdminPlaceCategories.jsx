import React, { useEffect, useState } from "react";
import "./AdminPlaceCategories.css";

const API_URL = process.env.REACT_APP_API_URL;

function AdminPlaceCategories() {
    const [places, setPlaces] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState("");
    const [assignedCategories, setAssignedCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    // Load places and categories
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [placesResponse, categoriesResponse] = await Promise.all([
                fetch(`${API_URL}/places`),
                fetch(`${API_URL}/categories`),
            ]);

            const placesData = await placesResponse.json();
            const categoriesData = await categoriesResponse.json();

            if (!placesResponse.ok) {
                throw new Error(placesData.message || "Failed to load places");
            }

            if (!categoriesResponse.ok) {
                throw new Error(
                    categoriesData.message || "Failed to load categories"
                );
            }

            setPlaces(placesData.places || placesData.data || []);
            setCategories(categoriesData.categories || categoriesData.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load categories assigned to selected place
    const loadAssignedCategories = async (placeId) => {
        if (!placeId) {
            setAssignedCategories([]);
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `${API_URL}/place-categories/place/${placeId}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load assigned categories"
                );
            }

            setAssignedCategories(
                data.categories || data.data || []
            );
        } catch (err) {
            setError(err.message);
            setAssignedCategories([]);
        }
    };

    const handlePlaceChange = (event) => {
        const placeId = event.target.value;

        setSelectedPlace(placeId);
        setMessage("");

        loadAssignedCategories(placeId);
    };

    // Check whether category is already assigned
    const isAssigned = (categoryId) => {
        return assignedCategories.some(
            (category) => Number(category.id) === Number(categoryId)
        );
    };

    // Assign category to place
    const handleAssign = async (categoryId) => {
        if (!selectedPlace) {
            setError("Please select a place first.");
            return;
        }

        if (!token) {
            setError("You must be logged in as an admin.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/place-categories`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        placeId: Number(selectedPlace),
                        categoryId: Number(categoryId),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to assign category"
                );
            }

            setMessage("Category assigned successfully.");

            await loadAssignedCategories(selectedPlace);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // Remove category from place
    const handleRemove = async (categoryId) => {
        if (!selectedPlace) return;

        if (!window.confirm("Remove this category from the selected place?")) {
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/place-categories/place/${selectedPlace}/category/${categoryId}`,
                {
                    method: "DELETE",
                    headers,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to remove category"
                );
            }

            setMessage("Category removed successfully.");

            await loadAssignedCategories(selectedPlace);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-place-categories">
                <div className="pc-loading">
                    Loading places and categories...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-place-categories">
            <div className="pc-header">
                <div>
                    <h2>Place Categories</h2>
                    <p>
                        Choose which house categories are available in each place.
                    </p>
                </div>
            </div>

            {message && (
                <div className="pc-alert pc-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="pc-alert pc-error">
                    {error}
                </div>
            )}

            <div className="pc-layout">
                {/* PLACE SELECTION */}
                <div className="pc-card pc-place-card">
                    <div className="pc-card-title">
                        <h3>Select Place</h3>
                        <span>{places.length} places</span>
                    </div>

                    <select
                        value={selectedPlace}
                        onChange={handlePlaceChange}
                        className="pc-select"
                    >
                        <option value="">
                            -- Choose a place --
                        </option>

                        {places.map((place) => (
                            <option key={place.id} value={place.id}>
                                {place.name}
                            </option>
                        ))}
                    </select>

                    {selectedPlace && (
                        <div className="pc-current-place">
                            {(() => {
                                const place = places.find(
                                    (item) =>
                                        Number(item.id) === Number(selectedPlace)
                                );

                                return place ? (
                                    <>
                                        <strong>{place.name}</strong>
                                        <span>
                      {assignedCategories.length} categories assigned
                    </span>
                                    </>
                                ) : null;
                            })()}
                        </div>
                    )}
                </div>

                {/* CATEGORY MANAGEMENT */}
                <div className="pc-card pc-category-card">
                    <div className="pc-card-title">
                        <h3>House Categories</h3>
                        <span>{categories.length} categories</span>
                    </div>

                    {!selectedPlace ? (
                        <div className="pc-empty">
                            <div className="pc-empty-icon">📍</div>
                            <h3>Select a place</h3>
                            <p>
                                Choose a place from the left to manage its available
                                house categories.
                            </p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="pc-empty">
                            <div className="pc-empty-icon">🏠</div>
                            <h3>No categories available</h3>
                            <p>
                                Add house categories first from the Categories section.
                            </p>
                        </div>
                    ) : (
                        <div className="pc-category-list">
                            {categories.map((category) => {
                                const assigned = isAssigned(category.id);

                                return (
                                    <div
                                        className={`pc-category-item ${
                                            assigned ? "assigned" : ""
                                        }`}
                                        key={category.id}
                                    >
                                        <div className="pc-category-info">
                                            <div className="pc-category-icon">
                                                🏠
                                            </div>

                                            <div>
                                                <h4>{category.name}</h4>

                                                {category.description && (
                                                    <p>{category.description}</p>
                                                )}
                                            </div>
                                        </div>

                                        {assigned ? (
                                            <button
                                                type="button"
                                                className="pc-remove-button"
                                                onClick={() =>
                                                    handleRemove(category.id)
                                                }
                                                disabled={saving}
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="pc-assign-button"
                                                onClick={() =>
                                                    handleAssign(category.id)
                                                }
                                                disabled={saving}
                                            >
                                                Assign
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* SUMMARY */}
            {selectedPlace && (
                <div className="pc-summary">
                    <h3>Currently Available</h3>

                    <div className="pc-summary-list">
                        {assignedCategories.length === 0 ? (
                            <span className="pc-no-category">
                No categories assigned to this place.
              </span>
                        ) : (
                            assignedCategories.map((category) => (
                                <span
                                    className="pc-summary-tag"
                                    key={category.id}
                                >
                  {category.name}
                </span>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPlaceCategories;