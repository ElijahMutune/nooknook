import React, { useCallback, useEffect, useState } from "react";
import "./AdminAmenities.css";

const API_URL = process.env.REACT_APP_API_URL;

const AdminAmenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getToken = () => localStorage.getItem("token");

    const requestHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
    });

    const loadAmenities = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/amenities`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to load amenities.");
            }

            setAmenities(data.amenities || []);
        } catch (err) {
            setError(err.message || "Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAmenities();
    }, [loadAmenities]);

    const handleAdd = async (event) => {
        event.preventDefault();

        const cleanName = name.trim();

        if (!cleanName) {
            setError("Please enter an amenity name.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_URL}/amenities`, {
                method: "POST",
                headers: requestHeaders(),
                body: JSON.stringify({ name: cleanName }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to add amenity.");
            }

            setName("");
            setSuccess(data.message || "Amenity added successfully.");
            await loadAmenities();
        } catch (err) {
            setError(err.message || "Could not add amenity.");
        } finally {
            setSaving(false);
        }
    };

    const startEditing = (amenity) => {
        setEditingId(amenity.id);
        setEditingName(amenity.name);
        setError("");
        setSuccess("");
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName("");
    };

    const handleUpdate = async (id) => {
        const cleanName = editingName.trim();

        if (!cleanName) {
            setError("Amenity name cannot be empty.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_URL}/amenities/${id}`, {
                method: "PUT",
                headers: requestHeaders(),
                body: JSON.stringify({ name: cleanName }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to update amenity.");
            }

            cancelEditing();
            setSuccess(data.message || "Amenity updated successfully.");
            await loadAmenities();
        } catch (err) {
            setError(err.message || "Could not update amenity.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (amenity) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${amenity.name}"?`
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_URL}/amenities/${amenity.id}`, {
                method: "DELETE",
                headers: requestHeaders(),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to delete amenity.");
            }

            if (editingId === amenity.id) {
                cancelEditing();
            }

            setSuccess(data.message || "Amenity deleted successfully.");
            await loadAmenities();
        } catch (err) {
            setError(err.message || "Could not delete amenity.");
        }
    };

    return (
        <section className="admin-amenities">
            <div className="admin-amenities-header">
                <div>
                    <h2>Manage Amenities</h2>
                    <p>
                        Add and manage the facilities available in your property listings.
                    </p>
                </div>

                <div className="amenities-count">
                    <span>Total Amenities</span>
                    <strong>{amenities.length}</strong>
                </div>
            </div>

            <form className="amenity-add-form" onSubmit={handleAdd}>
                <label htmlFor="amenity-name">Amenity name</label>

                <div className="amenity-add-controls">
                    <input
                        id="amenity-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Wi-Fi, Parking, Water"
                        maxLength={100}
                        required
                    />

                    <button type="submit" disabled={saving}>
                        {saving ? "Please wait..." : "+ Add Amenity"}
                    </button>
                </div>
            </form>

            {error && (
                <div className="amenity-message amenity-error" role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="amenity-message amenity-success" role="status">
                    {success}
                </div>
            )}

            <div className="amenities-table-card">
                <div className="amenities-table-heading">
                    <h3>All Amenities</h3>
                    <button
                        type="button"
                        className="amenity-refresh-button"
                        onClick={loadAmenities}
                        disabled={loading}
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <p className="amenities-empty">Loading amenities...</p>
                ) : amenities.length === 0 ? (
                    <p className="amenities-empty">
                        No amenities found. Add your first amenity above.
                    </p>
                ) : (
                    <div className="amenities-table-wrapper">
                        <table className="amenities-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Amenity name</th>
                                <th>Date created</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {amenities.map((amenity, index) => (
                                <tr key={amenity.id}>
                                    <td>{index + 1}</td>

                                    <td>
                                        {editingId === amenity.id ? (
                                            <input
                                                className="amenity-edit-input"
                                                value={editingName}
                                                onChange={(event) =>
                                                    setEditingName(event.target.value)
                                                }
                                                maxLength={100}
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="amenity-name">
                          {amenity.name}
                        </span>
                                        )}
                                    </td>

                                    <td>
                                        {amenity.created_at
                                            ? new Date(amenity.created_at).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    <td>
                                        <div className="amenity-actions">
                                            {editingId === amenity.id ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="amenity-save-button"
                                                        onClick={() => handleUpdate(amenity.id)}
                                                        disabled={saving}
                                                    >
                                                        Save
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="amenity-cancel-button"
                                                        onClick={cancelEditing}
                                                        disabled={saving}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="amenity-edit-button"
                                                        onClick={() => startEditing(amenity)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="amenity-delete-button"
                                                        onClick={() => handleDelete(amenity)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminAmenities;