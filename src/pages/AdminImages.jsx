import React, { useEffect, useState } from "react";
import "./AdminImages.css";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

function AdminImages() {
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState("");
    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [loadingProperties, setLoadingProperties] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // Load properties
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoadingProperties(true);
            setError("");

            const response = await fetch(
                `${API_URL}/properties`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load properties"
                );
            }

            setProperties(data.properties || []);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoadingProperties(false);
        }
    };

    // Load images for selected property
    const fetchImages = async (propertyId) => {
        if (!propertyId) {
            setImages([]);
            return;
        }

        try {
            setLoadingImages(true);
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/property-images/property/${propertyId}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load images"
                );
            }

            setImages(data.images || []);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setImages([]);
        } finally {
            setLoadingImages(false);
        }
    };

    const handlePropertyChange = (e) => {
        const propertyId = e.target.value;

        setSelectedProperty(propertyId);
        setSelectedFiles([]);
        setMessage("");
        setError("");

        fetchImages(propertyId);
    };

    // Select images
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) {
            return;
        }

        if (files.length > 10) {
            setError(
                "You can select a maximum of 10 images at once."
            );

            setSelectedFiles(files.slice(0, 10));
            return;
        }

        const invalidFile = files.find(
            (file) =>
                ![
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/webp"
                ].includes(file.type)
        );

        if (invalidFile) {
            setError(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );
            return;
        }

        const tooLarge = files.find(
            (file) =>
                file.size > 5 * 1024 * 1024
        );

        if (tooLarge) {
            setError(
                "Each image must be 5 MB or smaller."
            );
            return;
        }

        setError("");
        setMessage("");
        setSelectedFiles(files);
    };

    // Upload images
    const handleUpload = async () => {
        if (!selectedProperty) {
            setError("Please select a property first.");
            return;
        }

        if (selectedFiles.length === 0) {
            setError("Please select at least one image.");
            return;
        }

        if (!token) {
            setError(
                "You are not logged in as an administrator."
            );
            return;
        }

        try {
            setUploading(true);
            setError("");
            setMessage("");

            const formData = new FormData();

            formData.append(
                "property_id",
                selectedProperty
            );

            selectedFiles.forEach((file) => {
                formData.append("images", file);
            });

            const response = await fetch(
                `${API_URL}/property-images`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to upload images"
                );
            }

            setMessage(
                "Images uploaded successfully."
            );

            setSelectedFiles([]);

            await fetchImages(selectedProperty);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    // Delete image
    const handleDelete = async (imageId) => {
        if (!window.confirm(
            "Are you sure you want to delete this image?"
        )) {
            return;
        }

        if (!token) {
            setError(
                "You are not logged in as an administrator."
            );
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/property-images/${imageId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete image"
                );
            }

            setMessage(
                "Image deleted successfully."
            );

            await fetchImages(selectedProperty);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return "";
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${SERVER_URL}${imageUrl}`;
    };

    const selectedPropertyData =
        properties.find(
            (property) =>
                String(property.id) ===
                String(selectedProperty)
        );

    return (
        <div className="admin-images">

            <div className="admin-images-header">
                <div>
                    <h2>Property Images</h2>
                    <p>
                        Manage photographs for your vacant
                        properties.
                    </p>
                </div>

                <div className="image-total">
                    {images.length} image
                    {images.length !== 1 ? "s" : ""}
                </div>
            </div>

            {message && (
                <div className="admin-image-message success">
                    {message}
                </div>
            )}

            {error && (
                <div className="admin-image-message error">
                    {error}
                </div>
            )}

            <div className="image-management-card">

                <div className="property-selector">
                    <label htmlFor="property-select">
                        Select Property
                    </label>

                    <select
                        id="property-select"
                        value={selectedProperty}
                        onChange={handlePropertyChange}
                        disabled={loadingProperties}
                    >
                        <option value="">
                            -- Select a property --
                        </option>

                        {properties.map((property) => (
                            <option
                                key={property.id}
                                value={property.id}
                            >
                                {property.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedPropertyData && (
                    <div className="selected-property-info">
                        <strong>
                            {selectedPropertyData.name}
                        </strong>

                        <span>
                            📍{" "}
                            {selectedPropertyData.location ||
                                selectedPropertyData.place_name ||
                                "Location not specified"}
                        </span>
                    </div>
                )}

                {selectedProperty && (
                    <div className="upload-area">

                        <div>
                            <h3>
                                Add More Images
                            </h3>

                            <p>
                                Select clear property
                                photographs. Maximum 10
                                images per upload.
                            </p>
                        </div>

                        <label
                            htmlFor="admin-image-upload"
                            className="admin-select-images"
                        >
                            📷 Select Images
                        </label>

                        <input
                            id="admin-image-upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            multiple
                            onChange={handleFileChange}
                            disabled={uploading}
                        />

                        {selectedFiles.length > 0 && (
                            <div className="selected-files">
                                <strong>
                                    {selectedFiles.length} image
                                    {selectedFiles.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    selected
                                </strong>

                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="upload-button"
                                >
                                    {uploading
                                        ? "Uploading..."
                                        : "Upload Images"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {loadingImages ? (
                    <div className="image-loading">
                        Loading images...
                    </div>
                ) : selectedProperty ? (
                    images.length > 0 ? (
                        <div className="admin-image-grid">
                            {images.map((image, index) => (
                                <div
                                    className="admin-image-card"
                                    key={image.id}
                                >
                                    <div className="admin-image-preview">
                                        <img
                                            src={getImageUrl(
                                                image.image_url
                                            )}
                                            alt={`Property ${
                                                index + 1
                                            }`}
                                        />

                                        {index === 0 && (
                                            <span className="main-image-badge">
                                                Main Image
                                            </span>
                                        )}
                                    </div>

                                    <div className="admin-image-footer">
                                        <span>
                                            Image {index + 1}
                                        </span>

                                        <button
                                            type="button"
                                            className="delete-image-button"
                                            onClick={() =>
                                                handleDelete(
                                                    image.id
                                                )
                                            }
                                        >
                                            🗑 Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-images">
                            <div className="no-images-icon">
                                🖼️
                            </div>

                            <h3>
                                No images yet
                            </h3>

                            <p>
                                Upload photographs for
                                this property above.
                            </p>
                        </div>
                    )
                ) : (
                    <div className="choose-property">
                        <div>
                            🏠
                        </div>

                        <h3>
                            Select a property
                        </h3>

                        <p>
                            Choose a property above to
                            manage its images.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminImages;