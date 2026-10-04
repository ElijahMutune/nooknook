import React, { useEffect, useState } from "react";
import "./AdminPlaces.css";

const API_URL = process.env.REACT_APP_API_URL;

const AdminPlaces = () => {
    const [places, setPlaces] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const getToken = () => {
        return localStorage.getItem("token");
    };

    // LOAD PLACES
    const fetchPlaces = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/places`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load places"
                );
            }

            setPlaces(data.places || []);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    // ADD PLACE
    const addPlace = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Please enter a place name.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const token = getToken();

            if (!token) {
                setError(
                    "You must be logged in as an admin."
                );
                return;
            }

            const placeName = name.trim();

            // Automatically create slug
            const slug = placeName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            const response = await fetch(
                `${API_URL}/places`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: placeName,
                        slug: slug
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add place"
                );
            }

            setMessage(
                "Place added successfully."
            );

            setName("");

            await fetchPlaces();

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // ACTIVATE / DEACTIVATE PLACE
    const togglePlace = async (place) => {
        try {
            setError("");
            setMessage("");

            const token = getToken();

            if (!token) {
                setError(
                    "You must be logged in as an admin."
                );
                return;
            }

            const response = await fetch(
                `${API_URL}/places/${place.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: place.name,
                        slug: place.slug,
                        is_active: !place.is_active
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update place"
                );
            }

            setMessage(
                `${place.name} is now ${
                    !place.is_active
                        ? "active"
                        : "inactive"
                }.`
            );

            await fetchPlaces();

        } catch (err) {
            setError(err.message);
        }
    };

    // DELETE PLACE
    const deletePlace = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this place?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const token = getToken();

            if (!token) {
                setError(
                    "You must be logged in as an admin."
                );
                return;
            }

            const response = await fetch(
                `${API_URL}/places/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete place"
                );
            }

            setMessage(
                "Place deleted successfully."
            );

            await fetchPlaces();

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="admin-places">

            {/* HEADER */}
            <div className="places-header">

                <div>
                    <span className="section-label">
                        LOCATION MANAGEMENT
                    </span>

                    <h2>Places</h2>

                    <p>
                        Add and manage locations where
                        NookNook properties are available.
                    </p>
                </div>

                <div className="places-count">
                    <strong>{places.length}</strong>
                    <span>Total Places</span>
                </div>

            </div>

            {/* SUCCESS MESSAGE */}
            {message && (
                <div className="admin-alert success-alert">
                    ✓ {message}
                </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
                <div className="admin-alert error-alert">
                    ⚠ {error}
                </div>
            )}

            <div className="places-grid">

                {/* ADD PLACE */}
                <section className="place-form-card">

                    <div className="card-heading">

                        <div className="card-icon">
                            📍
                        </div>

                        <div>
                            <h3>Add New Place</h3>
                            <p>
                                Create a new location
                            </p>
                        </div>

                    </div>

                    <form onSubmit={addPlace}>

                        <label htmlFor="placeName">
                            Place Name
                        </label>

                        <input
                            id="placeName"
                            type="text"
                            placeholder="e.g. Mombasa"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            disabled={saving}
                        />

                        <button
                            type="submit"
                            className="primary-admin-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Adding..."
                                : "+ Add Place"}
                        </button>

                    </form>

                </section>

                {/* PLACES LIST */}
                <section className="places-list-card">

                    <div className="card-heading">

                        <div className="card-icon">
                            🗺️
                        </div>

                        <div>
                            <h3>Existing Places</h3>
                            <p>
                                Locations currently in
                                the system
                            </p>
                        </div>

                    </div>

                    {loading ? (

                        <div className="places-loading">
                            Loading places...
                        </div>

                    ) : places.length === 0 ? (

                        <div className="places-empty">

                            <span>📍</span>

                            <strong>
                                No places yet
                            </strong>

                            <p>
                                Add your first place
                                using the form.
                            </p>

                        </div>

                    ) : (

                        <div className="places-table-wrapper">

                            <table className="places-table">

                                <thead>
                                <tr>
                                    <th>Place</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>

                                {places.map((place) => (

                                    <tr key={place.id}>

                                        <td>

                                            <div className="place-name">

                                                <div className="place-avatar">
                                                    {place.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>

                                                    <strong>
                                                        {place.name}
                                                    </strong>

                                                    <small>
                                                        /{place.slug}
                                                    </small>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                                <span
                                                    className={`status-badge ${
                                                        place.is_active
                                                            ? "active-status"
                                                            : "inactive-status"
                                                    }`}
                                                >
                                                    {place.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                        </td>

                                        <td>

                                            <div className="place-actions">

                                                <button
                                                    className="action-button"
                                                    onClick={() =>
                                                        togglePlace(place)
                                                    }
                                                >
                                                    {place.is_active
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deletePlace(
                                                            place.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
};

export default AdminPlaces;