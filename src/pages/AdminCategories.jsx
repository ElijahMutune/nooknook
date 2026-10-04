import React, { useEffect, useState } from "react";
import "./AdminCategories.css";

const API_URL = process.env.REACT_APP_API_URL;

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const getToken = () => {
        return localStorage.getItem("token");
    };

    // LOAD CATEGORIES
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/categories`
);

const data = await response.json();

if (!response.ok) {
    throw new Error(
        data.message ||
        "Failed to load categories"
    );
}

setCategories(data.categories || []);

} catch (err) {
    setError(err.message);
} finally {
    setLoading(false);
}
};

useEffect(() => {
    fetchCategories();
}, []);

// ADD CATEGORY
const addCategory = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!name.trim()) {
        setError("Please enter a category name.");
        return;
    }

    try {
        setSaving(true);

        const token = getToken();

        if (!token) {
            setError(
                "You must be logged in as an admin."
            );
            return;
        }

        const categoryName = name.trim();

        // Automatically create slug
        const slug = categoryName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const response = await fetch(
            `${API_URL}/categories`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: categoryName,
                    slug: slug,
                    description:
                        description.trim() || null
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to add category"
            );
        }

        setMessage(
            "Category added successfully."
        );

        setName("");
        setDescription("");

        await fetchCategories();

    } catch (err) {
        setError(err.message);
    } finally {
        setSaving(false);
    }
};

// ACTIVATE / DEACTIVATE
const toggleCategory = async (category) => {
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
            `${API_URL}/categories/${category.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: category.name,
                    slug: category.slug,
                    description:
                        category.description || null,
                    is_active:
                        !category.is_active
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to update category"
            );
        }

        setMessage(
            `${category.name} is now ${
                !category.is_active
                    ? "active"
                    : "inactive"
            }.`
        );

        await fetchCategories();

    } catch (err) {
        setError(err.message);
    }
};

// DELETE CATEGORY
const deleteCategory = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this category?"
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
            `${API_URL}/categories/${id}`,
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
                "Failed to delete category"
            );
        }

        setMessage(
            "Category deleted successfully."
        );

        await fetchCategories();

    } catch (err) {
        setError(err.message);
    }
};

return (
    <div className="admin-categories">

        {/* HEADER */}
        <div className="categories-header">

            <div>
                    <span className="section-label">
                        HOUSE TYPE MANAGEMENT
                    </span>

                <h2>Categories</h2>

                <p>
                    Add and manage the types of
                    properties available on NookNook.
                </p>
            </div>

            <div className="categories-count">
                <strong>
                    {categories.length}
                </strong>

                <span>
                        Total Categories
                    </span>
            </div>

        </div>

        {/* SUCCESS */}
        {message && (
            <div className="admin-alert success-alert">
                ✓ {message}
            </div>
        )}

        {/* ERROR */}
        {error && (
            <div className="admin-alert error-alert">
                ⚠ {error}
            </div>
        )}

        <div className="categories-grid">

            {/* ADD CATEGORY */}
            <section className="category-form-card">

                <div className="card-heading">

                    <div className="card-icon">
                        🏷️
                    </div>

                    <div>
                        <h3>
                            Add New Category
                        </h3>

                        <p>
                            Create a new house type
                        </p>
                    </div>

                </div>

                <form onSubmit={addCategory}>

                    <label htmlFor="categoryName">
                        Category Name
                    </label>

                    <input
                        id="categoryName"
                        type="text"
                        placeholder="e.g. 1 Bedroom"
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }
                        disabled={saving}
                    />

                    <label htmlFor="categoryDescription">
                        Description
                    </label>

                    <textarea
                        id="categoryDescription"
                        placeholder="Describe this property type"
                        value={description}
                        onChange={(event) =>
                            setDescription(
                                event.target.value
                            )
                        }
                        rows="4"
                        disabled={saving}
                    />

                    <button
                        type="submit"
                        className="primary-admin-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Adding..."
                            : "+ Add Category"}
                    </button>

                </form>

            </section>

            {/* CATEGORY LIST */}
            <section className="categories-list-card">

                <div className="card-heading">

                    <div className="card-icon">
                        🏠
                    </div>

                    <div>
                        <h3>
                            Existing Categories
                        </h3>

                        <p>
                            Property types currently
                            in the system
                        </p>
                    </div>

                </div>

                {loading ? (

                    <div className="categories-loading">
                        Loading categories...
                    </div>

                ) : categories.length === 0 ? (

                    <div className="categories-empty">

                        <span>🏷️</span>

                        <strong>
                            No categories yet
                        </strong>

                        <p>
                            Add your first property
                            type using the form.
                        </p>

                    </div>

                ) : (

                    <div className="categories-table-wrapper">

                        <table className="categories-table">

                            <thead>
                            <tr>
                                <th>
                                    Category
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody>

                            {categories.map(
                                (category) => (

                                    <tr
                                        key={
                                            category.id
                                        }
                                    >

                                        <td>

                                            <div className="category-name">

                                                <div className="category-avatar">
                                                    🏠
                                                </div>

                                                <div>

                                                    <strong>
                                                        {
                                                            category.name
                                                        }
                                                    </strong>

                                                    <small>
                                                        /{
                                                        category.slug
                                                    }
                                                    </small>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                                    <span
                                                        className={`status-badge ${
                                                            category.is_active
                                                                ? "active-status"
                                                                : "inactive-status"
                                                        }`}
                                                    >
                                                        {
                                                            category.is_active
                                                                ? "Active"
                                                                : "Inactive"
                                                        }
                                                    </span>

                                        </td>

                                        <td>

                                            <div className="category-actions">

                                                <button
                                                    className="action-button"
                                                    onClick={() =>
                                                        toggleCategory(
                                                            category
                                                        )
                                                    }
                                                >
                                                    {
                                                        category.is_active
                                                            ? "Deactivate"
                                                            : "Activate"
                                                    }
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deleteCategory(
                                                            category.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>

    </div>
);
};

export default AdminCategories;