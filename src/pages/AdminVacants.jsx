import React, { useEffect, useState } from "react";
import "./AdminVacants.css";

const API_URL = process.env.REACT_APP_API_URL;

function AdminVacants() {
    const [vacants, setVacants] = useState([]);

    const [places, setPlaces] = useState([]);
    const [categories, setCategories] = useState([]);
    const [amenities, setAmenities] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ==========================================
    // BASIC PROPERTY INFORMATION
    // ==========================================

    const [formData, setFormData] = useState({
        place_id: "",
        category_id: "",
        name: "",
        price: "",
        billing_period: "month",
        description: "",
        location: "",
        bedrooms: 0,
        bathrooms: 0,
    });

    // ==========================================
    // PREMIUM / OWNER INFORMATION
    // ==========================================

    const [premiumData, setPremiumData] = useState({
        exact_location: "",
        full_description: "",
        landlord_name: "",
        landlord_phone: "",
        landlord_email: "",
        directions: "",
        security_details: "",
        parking_details: "",
        nearby_facilities: "",
        house_rules: "",
        additional_information: "",
    });

    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    const token = localStorage.getItem("token");

    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {
        fetchVacants();
        fetchPlaces();
        fetchAmenities();
    }, []);

    const fetchVacants = async () => {
        try {
            const response = await fetch(`${API_URL}/properties`);
            const data = await response.json();

            if (data.success) {
                setVacants(data.properties || []);
            }
        } catch (error) {
            console.error("Failed to load vacants:", error);
        }
    };

    const fetchPlaces = async () => {
        try {
            const response = await fetch(`${API_URL}/places`);
            const data = await response.json();

            if (data.success) {
                setPlaces(data.places || []);
            }
        } catch (error) {
            console.error("Failed to load places:", error);
        }
    };

    const fetchAmenities = async () => {
        try {
            const response = await fetch(`${API_URL}/amenities`);
            const data = await response.json();

            if (data.success) {
                setAmenities(data.amenities || []);
            }
        } catch (error) {
            console.error("Failed to load amenities:", error);
        }
    };

    // ==========================================
    // LOAD CATEGORIES FOR SELECTED PLACE
    // ==========================================

    const handlePlaceChange = async (e) => {
        const placeId = e.target.value;

        setFormData((prev) => ({
            ...prev,
            place_id: placeId,
            category_id: "",
        }));

        setCategories([]);

        if (!placeId) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/place-categories/place/${placeId}`
            );

            const data = await response.json();

            if (data.success) {
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    };

    // ==========================================
    // BASIC FORM INPUT
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==========================================
    // PREMIUM FORM INPUT
    // ==========================================

    const handlePremiumChange = (e) => {
        const { name, value } = e.target;

        setPremiumData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==========================================
    // AMENITIES
    // ==========================================

    const toggleAmenity = (amenityId) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenityId)
                ? prev.filter((id) => id !== amenityId)
                : [...prev, amenityId]
        );
    };

    // ==========================================
// PROPERTY IMAGES
// ==========================================

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) {
            return;
        }

        const remainingSlots = 10 - selectedImages.length;

        if (remainingSlots <= 0) {
            setMessage("You can upload a maximum of 10 images.");
            return;
        }

        const filesToAdd = files.slice(0, remainingSlots);

        const invalidFile = filesToAdd.find(
            (file) => !file.type.startsWith("image/")
        );

        if (invalidFile) {
            setMessage(
                "Only image files can be uploaded."
            );
            return;
        }

        const tooLarge = filesToAdd.find(
            (file) => file.size > 5 * 1024 * 1024
        );

        if (tooLarge) {
            setMessage(
                "Each image must be 5 MB or smaller."
            );
            return;
        }

        setSelectedImages((prev) => [
            ...prev,
            ...filesToAdd
        ]);

        setMessage("");
    };


// Remove one selected image
    const removeSelectedImage = (index) => {
        setSelectedImages((prev) =>
            prev.filter((_, imageIndex) => imageIndex !== index)
        );
    };

    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {
        setFormData({
            place_id: "",
            category_id: "",
            name: "",
            price: "",
            billing_period: "month",
            description: "",
            location: "",
            bedrooms: 0,
            bathrooms: 0,
        });

        setPremiumData({
            exact_location: "",
            full_description: "",
            landlord_name: "",
            landlord_phone: "",
            landlord_email: "",
            directions: "",
            security_details: "",
            parking_details: "",
            nearby_facilities: "",
            house_rules: "",
            additional_information: "",
        });

        setSelectedAmenities([]);
        setSelectedImages([]);
        setCategories([]);
    };

    // ==========================================
    // CREATE VACANT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            // ------------------------------------------
            // 1. CREATE PROPERTY
            // ------------------------------------------

            const propertyResponse = await fetch(
                `${API_URL}/properties`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        ...formData,
                        place_id: Number(formData.place_id),
                        category_id: Number(formData.category_id),
                        price: Number(formData.price),
                        bedrooms: Number(formData.bedrooms),
                        bathrooms: Number(formData.bathrooms),
                    }),
                }
            );

            const propertyData = await propertyResponse.json();

            if (!propertyResponse.ok) {
                throw new Error(
                    propertyData.message ||
                    "Failed to create vacant"
                );
            }

            const propertyId = propertyData.property.id;


            // ------------------------------------------
// 2. UPLOAD PROPERTY IMAGES
// ------------------------------------------

            if (selectedImages.length > 0) {

                const imageFormData = new FormData();

                imageFormData.append(
                    "property_id",
                    propertyId
                );

                selectedImages.forEach((file) => {
                    imageFormData.append(
                        "images",
                        file
                    );
                });

                const imageResponse = await fetch(
                    `${API_URL}/property-images`,
                    {
                        method: "POST",

                        headers: {
                            Authorization: `Bearer ${token}`,
                        },

                        body: imageFormData,
                    }
                );

                const imageData =
                    await imageResponse.json();

                if (!imageResponse.ok) {
                    throw new Error(
                        imageData.message ||
                        "Failed to upload property images"
                    );
                }
            }

            // ------------------------------------------
            // 3. SAVE AMENITIES
            // ------------------------------------------

            const amenitiesResponse = await fetch(
                `${API_URL}/property-amenities/property/${propertyId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        amenity_ids: selectedAmenities.map(Number),
                    }),
                }
            );

            const amenitiesData =
                await amenitiesResponse.json();

            if (!amenitiesResponse.ok) {
                throw new Error(
                    amenitiesData.message ||
                    "Failed to save property amenities"
                );
            }

            // ------------------------------------------
            // 4. SAVE PREMIUM / OWNER INFORMATION
            // ------------------------------------------

            const premiumResponse = await fetch(
                `${API_URL}/premium-information/property/${propertyId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(premiumData),
                }
            );

            const premiumResult =
                await premiumResponse.json();

            if (!premiumResponse.ok) {
                throw new Error(
                    premiumResult.message ||
                    "Failed to save premium information"
                );
            }

            // ------------------------------------------
            // SUCCESS
            // ------------------------------------------

            setMessage(
                "Vacant property, amenities and premium information saved successfully."
            );

            resetForm();

            await fetchVacants();

            setTimeout(() => {
                setShowForm(false);
                setMessage("");
            }, 1800);

        } catch (error) {
            console.error(
                "Create vacant error:",
                error
            );

            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // DELETE VACANT
    // ==========================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this vacant property?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/properties/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete property"
                );
            }

            await fetchVacants();

        } catch (error) {
            console.error(
                "Delete vacant error:",
                error
            );

            alert(error.message);
        }
    };

    return (
        <div className="admin-vacants">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="vacants-header">
                <div>
                    <h1>Vacant Properties</h1>

                    <p>
                        Add and manage vacant rooms, houses
                        and guest accommodation.
                    </p>
                </div>

                <button
                    className="add-vacant-button"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                        setMessage("");
                    }}
                >
                    + Add Vacant
                </button>
            </div>

            {/* ==========================================
                MESSAGE
            ========================================== */}

            {message && (
                <div className="vacant-message">
                    {message}
                </div>
            )}

            {/* ==========================================
                ADD FORM
            ========================================== */}

            {showForm && (
                <div className="vacant-form-card">

                    <div className="form-card-header">

                        <div>
                            <h2>
                                Add Vacant Property
                            </h2>

                            <p>
                                Enter all available information
                                about this property.
                            </p>
                        </div>

                        <button
                            className="close-form-button"
                            type="button"
                            onClick={() =>
                                setShowForm(false)
                            }
                        >
                            ×
                        </button>

                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* ==========================================
                            BASIC INFORMATION
                        ========================================== */}

                        <div className="form-section">

                            <h3>
                                🏠 Basic Information
                            </h3>

                            <p className="section-description">
                                Information that ordinary visitors
                                can see.
                            </p>

                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Property Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Modern Single Room"
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Place *
                                    </label>

                                    <select
                                        value={formData.place_id}
                                        onChange={handlePlaceChange}
                                        required
                                    >

                                        <option value="">
                                            Select place
                                        </option>

                                        {places.map(
                                            (place) => (
                                                <option
                                                    key={place.id}
                                                    value={place.id}
                                                >
                                                    {place.name}
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Property Type *
                                    </label>

                                    <select
                                        name="category_id"
                                        value={
                                            formData.category_id
                                        }
                                        onChange={handleChange}
                                        required
                                        disabled={
                                            !formData.place_id
                                        }
                                    >

                                        <option value="">
                                            {formData.place_id
                                                ? "Select property type"
                                                : "Select place first"}
                                        </option>

                                        {categories.map(
                                            (category) => (
                                                <option
                                                    key={
                                                        category.id
                                                    }
                                                    value={
                                                        category.id
                                                    }
                                                >
                                                    {
                                                        category.name
                                                    }
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Price *
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="5000"
                                        min="0"
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Billing Period
                                    </label>

                                    <select
                                        name="billing_period"
                                        value={
                                            formData.billing_period
                                        }
                                        onChange={handleChange}
                                    >

                                        <option value="month">
                                            Month
                                        </option>

                                        <option value="day">
                                            Day
                                        </option>

                                        <option value="night">
                                            Night
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        General Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Near town centre"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Bedrooms
                                    </label>

                                    <input
                                        type="number"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                        min="0"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Bathrooms
                                    </label>

                                    <input
                                        type="number"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        min="0"
                                    />

                                </div>

                            </div>

                            <div className="form-group full-width">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={handleChange}
                                    placeholder="Describe the vacant property..."
                                    rows="4"
                                />

                            </div>

                        </div>

                        {/* ==========================================
                            AMENITIES
                        ========================================== */}

                        <div className="form-section">

                            <h3>
                                ✨ Amenities
                            </h3>

                            <p className="section-description">
                                Select all amenities available
                                in this property.
                            </p>

                            {amenities.length === 0 ? (

                                <p className="empty-text">
                                    No amenities available.
                                </p>

                            ) : (

                                <div className="amenities-grid">

                                    {amenities.map(
                                        (amenity) => (

                                            <label
                                                key={
                                                    amenity.id
                                                }
                                                className={
                                                    selectedAmenities.includes(
                                                        amenity.id
                                                    )
                                                        ? "amenity-option selected"
                                                        : "amenity-option"
                                                }
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={selectedAmenities.includes(
                                                        amenity.id
                                                    )}
                                                    onChange={() =>
                                                        toggleAmenity(
                                                            amenity.id
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {
                                                        amenity.name
                                                    }
                                                </span>

                                            </label>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                        {/* ==========================================
    PROPERTY IMAGES
========================================== */}

                        <div className="form-section image-section">

                            <div className="image-section-header">

                                <div>
                                    <h3>
                                        🖼️ Property Images
                                    </h3>

                                    <p className="section-description">
                                        Upload clear photographs of the vacant
                                        property. You can select up to 10 images.
                                    </p>
                                </div>

                                <span className="image-count">
            {selectedImages.length}/10
        </span>

                            </div>

                            {/* FILE INPUT */}

                            <div className="image-upload-area">

                                <input
                                    type="file"
                                    id="property-images"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    multiple
                                    onChange={handleImageChange}
                                    disabled={
                                        selectedImages.length >= 10 ||
                                        loading
                                    }
                                />

                                <label
                                    htmlFor="property-images"
                                    className="image-upload-button"
                                >
                                    📷 Select Property Images
                                </label>

                                <p>
                                    JPG, PNG or WEBP • Maximum 5 MB per image
                                </p>

                            </div>

                            {/* IMAGE PREVIEWS */}

                            {selectedImages.length > 0 && (

                                <div className="selected-images-grid">

                                    {selectedImages.map(
                                        (file, index) => (

                                            <div
                                                className="selected-image"
                                                key={`${file.name}-${index}`}
                                            >

                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Property ${index + 1}`}
                                                />

                                                <button
                                                    type="button"
                                                    className="remove-image-button"
                                                    onClick={() =>
                                                        removeSelectedImage(index)
                                                    }
                                                    disabled={loading}
                                                    aria-label={`Remove image ${index + 1}`}
                                                >
                                                    ×
                                                </button>

                                                <span>
                            Image {index + 1}
                        </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>
                        {/* ==========================================
                            PREMIUM INFORMATION
                        ========================================== */}

                        <div className="form-section premium-section">

                            <div className="premium-header">

                                <div>
                                    <h3>
                                        🔒 Premium / Owner Information
                                    </h3>

                                    <p>
                                        This section contains private
                                        information supplied by the
                                        property owner.
                                    </p>
                                </div>

                                <span className="premium-badge">
                                    PRIVATE
                                </span>

                            </div>

                            <div className="premium-notice">

                                <strong>
                                    🔐 Restricted Information
                                </strong>

                                <p>
                                    These details are not included
                                    in the ordinary customer's
                                    property response. They are
                                    available to administrators
                                    and authorized premium users.
                                </p>

                            </div>

                            <div className="form-grid">

                                {/* EXACT LOCATION */}

                                <div className="form-group">

                                    <label>
                                        Exact Location
                                    </label>

                                    <input
                                        type="text"
                                        name="exact_location"
                                        value={
                                            premiumData.exact_location
                                        }
                                        onChange={
                                            handlePremiumChange
                                        }
                                        placeholder="Exact house/building location"
                                    />

                                </div>

                                {/* LANDLORD NAME */}

                                <div className="form-group">

                                    <label>
                                        Owner / Landlord Name
                                    </label>

                                    <input
                                        type="text"
                                        name="landlord_name"
                                        value={
                                            premiumData.landlord_name
                                        }
                                        onChange={
                                            handlePremiumChange
                                        }
                                        placeholder="Property owner name"
                                    />

                                </div>

                                {/* PHONE */}

                                <div className="form-group">

                                    <label>
                                        Owner / Landlord Phone
                                    </label>

                                    <input
                                        type="tel"
                                        name="landlord_phone"
                                        value={
                                            premiumData.landlord_phone
                                        }
                                        onChange={
                                            handlePremiumChange
                                        }
                                        placeholder="e.g. 07XXXXXXXX"
                                    />

                                </div>

                                {/* EMAIL */}

                                <div className="form-group">

                                    <label>
                                        Owner / Landlord Email
                                    </label>

                                    <input
                                        type="email"
                                        name="landlord_email"
                                        value={
                                            premiumData.landlord_email
                                        }
                                        onChange={
                                            handlePremiumChange
                                        }
                                        placeholder="owner@example.com"
                                    />

                                </div>

                            </div>

                            {/* FULL DESCRIPTION */}

                            <div className="form-group full-width">

                                <label>
                                    Full Description
                                </label>

                                <textarea
                                    name="full_description"
                                    value={
                                        premiumData.full_description
                                    }
                                    onChange={
                                        handlePremiumChange
                                    }
                                    placeholder="Enter detailed information about the property..."
                                    rows="5"
                                />

                            </div>

                            {/* DIRECTIONS */}

                            <div className="form-group full-width">

                                <label>
                                    Directions
                                </label>

                                <textarea
                                    name="directions"
                                    value={
                                        premiumData.directions
                                    }
                                    onChange={
                                        handlePremiumChange
                                    }
                                    placeholder="Explain how the viewer can reach the property..."
                                    rows="4"
                                />

                            </div>

                            {/* SECURITY */}

                            <div className="form-group full-width">

                                <label>
                                    Security Details
                                </label>

                                <textarea
                                    name="security_details"
                                    value={
                                        premiumData.security_details
                                    }
                                    onChange={
                                        handlePremiumChange
                                    }
                                    placeholder="Security information, gate, guards, lighting, etc."
                                    rows="3"
                                />

                            </div>

                            {/* PARKING */}

                            <div className="form-group full-width">

                                <label>
                                    Parking Details
                                </label>

                                <textarea
                                    name="parking_details"
                                    value={
                                        premiumData.parking_details
                                    }
                                    onChange={
                                        handlePremiumChange
                                    }
                                    placeholder="Parking availability and details..."
                                    rows="3"
                                />

                            </div>

                            {/* NEARBY FACILITIES */}

                            <div className="form-group full-width">

                                <label>
                                    Nearby Facilities
                                </label>

                                <textarea
                                    name="nearby_facilities"
                                    value={
                                        premiumData.nearby_facilities
                                    }
                                    onChange={
                                        handlePremiumChange
                                    }
                                    placeholder="Schools, shops, hospitals, transport, markets, etc."
                                    rows="3"
                                />

                            </div>

                            {/* HOUSE RULES */}

                            <div className="form-group full-width">

                                <label>
                                    House Rules
                                </label>

                                <textarea
                                    name="house_rules"
                                    value={
                                        premiumData.house_rules
                                    }
                                    onChange={
                                        handlePremiumChange
                                    }
                                    placeholder="Enter rules provided by the owner..."
                                    rows="3"
                                />

                            </div>

                            {/* ADDITIONAL INFORMATION */}

                            <div className="form-group full-width">

                                <label>
                                    Additional Information
                                </label>

                                <textarea
                                    name="additional_information"
                                    value={
                                        premiumData.additional_information
                                    }
                                    onChange={
                                        handlePremiumChange
                                    }
                                    placeholder="Any other private information..."
                                    rows="4"
                                />

                            </div>

                        </div>

                        {/* ==========================================
                            ACTIONS
                        ========================================== */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    setShowForm(false)
                                }
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Vacant"}
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* ==========================================
                PROPERTY LIST
            ========================================== */}

            {!showForm && (
                <div className="vacants-table-card">

                    <div className="table-header">

                        <h2>
                            Available Vacants
                        </h2>

                        <span>
                            {vacants.length} properties
                        </span>

                    </div>

                    {vacants.length === 0 ? (

                        <div className="empty-vacants">

                            <div>🏠</div>

                            <h3>
                                No vacant properties yet
                            </h3>

                            <p>
                                Click "Add Vacant" to add
                                your first property.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                <tr>
                                    <th>Property</th>
                                    <th>Place</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>

                                </thead>

                                <tbody>

                                {vacants.map(
                                    (property) => (

                                        <tr
                                            key={
                                                property.id
                                            }
                                        >

                                            <td>
                                                <strong>
                                                    {
                                                        property.name
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    property.place_name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    property.category_name
                                                }
                                            </td>

                                            <td>
                                                KSh{" "}
                                                {Number(
                                                    property.price
                                                ).toLocaleString()}
                                                {" / "}
                                                {
                                                    property.billing_period
                                                }
                                            </td>

                                            <td>

                                                <span className="status-badge">
                                                    {
                                                        property.availability_status
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            property.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>
            )}

        </div>
    );
}

export default AdminVacants;