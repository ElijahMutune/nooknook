import React, { useEffect, useState } from "react";
import "./AdminUsers.css";

const API_URL = process.env.REACT_APP_API_URL;

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        account_type: "ordinary",
        premium_start_date: "",
        premium_end_date: "",
        membership_notes: ""
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/premium-users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load users."
                );
            }

            setUsers(data.users || []);

        } catch (err) {
            console.error("Users error:", err);
            setError(
                err.message ||
                "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openUser = (user) => {
        setSelectedUser(user);

        setForm({
            account_type: user.account_type || "ordinary",
            premium_start_date:
                user.premium_start_date
                    ? user.premium_start_date.substring(0, 10)
                    : "",
            premium_end_date:
                user.premium_end_date
                    ? user.premium_end_date.substring(0, 10)
                    : "",
            membership_notes:
                user.membership_notes || ""
        });
    };

    const closeUser = () => {
        setSelectedUser(null);
    };

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSave = async () => {
        if (!selectedUser) return;

        try {
            setSaving(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/premium-users/${selectedUser.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update user."
                );
            }

            await fetchUsers();
            closeUser();

        } catch (err) {
            console.error("Update user error:", err);

            setError(
                err.message ||
                "Unable to update user."
            );
        } finally {
            setSaving(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const searchText = search.toLowerCase();

        return (
            user.name?.toLowerCase().includes(searchText) ||
            user.email?.toLowerCase().includes(searchText) ||
            user.phone?.toLowerCase().includes(searchText)
        );
    });

    const totalUsers = users.length;

    const premiumUsers = users.filter(
        (user) => user.account_type === "premium"
    ).length;

    const ordinaryUsers = users.filter(
        (user) => user.account_type === "ordinary"
    ).length;

    const adminUsers = users.filter(
        (user) => user.role === "admin"
    ).length;

    return (
        <div className="admin-users">

            {/* HEADER */}
            <div className="users-page-header">

                <div>
                    <span className="page-label">
                        USER MANAGEMENT
                    </span>

                    <h2>Users</h2>

                    <p>
                        Manage registered NookNook users
                        and premium access.
                    </p>
                </div>

                <button
                    className="refresh-users-button"
                    onClick={fetchUsers}
                >
                    ↻ Refresh
                </button>

            </div>

            {/* ERROR */}
            {error && (
                <div className="users-error">
                    {error}
                </div>
            )}

            {/* STATISTICS */}
            <div className="users-stat-grid">

                <div className="users-stat-card">
                    <span className="users-stat-icon">
                        👥
                    </span>

                    <div>
                        <small>Total Users</small>
                        <strong>{totalUsers}</strong>
                    </div>
                </div>

                <div className="users-stat-card">
                    <span className="users-stat-icon">
                        👤
                    </span>

                    <div>
                        <small>Ordinary Users</small>
                        <strong>{ordinaryUsers}</strong>
                    </div>
                </div>

                <div className="users-stat-card">
                    <span className="users-stat-icon">
                        ⭐
                    </span>

                    <div>
                        <small>Premium Users</small>
                        <strong>{premiumUsers}</strong>
                    </div>
                </div>

                <div className="users-stat-card">
                    <span className="users-stat-icon">
                        🛡️
                    </span>

                    <div>
                        <small>Administrators</small>
                        <strong>{adminUsers}</strong>
                    </div>
                </div>

            </div>

            {/* SEARCH */}
            <div className="users-toolbar">

                <div className="users-search">

                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>

                <span className="users-count">
                    {filteredUsers.length} users
                </span>

            </div>

            {/* USERS TABLE */}
            <div className="users-table-card">

                {loading ? (
                    <div className="users-loading">
                        Loading users...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="users-empty">
                        <div>👥</div>
                        <h3>No users found</h3>
                        <p>
                            No users match your search.
                        </p>
                    </div>
                ) : (
                    <div className="users-table-wrapper">

                        <table className="users-table">

                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Account</th>
                                <th>Registered</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>

                            {filteredUsers.map((user) => (

                                <tr key={user.id}>

                                    <td>
                                        <div className="user-cell">

                                            <div className="user-avatar">
                                                {user.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <strong>
                                                    {user.name}
                                                </strong>

                                                <span>
                                                        {user.email}
                                                    </span>
                                            </div>

                                        </div>
                                    </td>

                                    <td>
                                        {user.phone || "—"}
                                    </td>

                                    <td>
                                            <span
                                                className={`role-badge ${
                                                    user.role === "admin"
                                                        ? "admin"
                                                        : "user"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                    </td>

                                    <td>
                                            <span
                                                className={`account-badge ${
                                                    user.account_type ===
                                                    "premium"
                                                        ? "premium"
                                                        : "ordinary"
                                                }`}
                                            >
                                                {user.account_type}
                                            </span>
                                    </td>

                                    <td>
                                        {user.created_at
                                            ? new Date(
                                                user.created_at
                                            ).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    <td>
                                        <button
                                            className="view-user-button"
                                            onClick={() =>
                                                openUser(user)
                                            }
                                        >
                                            View / Edit
                                        </button>
                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* USER MODAL */}
            {selectedUser && (
                <div
                    className="user-modal-overlay"
                    onClick={closeUser}
                >

                    <div
                        className="user-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="user-modal-header">

                            <div>
                                <span>
                                    USER #{selectedUser.id}
                                </span>

                                <h3>
                                    {selectedUser.name}
                                </h3>
                            </div>

                            <button
                                className="close-modal-button"
                                onClick={closeUser}
                            >
                                ×
                            </button>

                        </div>

                        <div className="user-details">

                            <div className="detail-row">
                                <span>Email</span>
                                <strong>
                                    {selectedUser.email}
                                </strong>
                            </div>

                            <div className="detail-row">
                                <span>Phone</span>
                                <strong>
                                    {selectedUser.phone || "—"}
                                </strong>
                            </div>

                            <div className="detail-row">
                                <span>Role</span>
                                <strong>
                                    {selectedUser.role}
                                </strong>
                            </div>

                            {selectedUser.role === "admin" ? (
                                <div className="admin-protected-message">
                                    🛡️ Admin accounts cannot be
                                    changed from this section.
                                </div>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>
                                            Account Type
                                        </label>

                                        <select
                                            name="account_type"
                                            value={
                                                form.account_type
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="ordinary">
                                                Ordinary
                                            </option>

                                            <option value="premium">
                                                Premium
                                            </option>
                                        </select>
                                    </div>

                                    {form.account_type ===
                                        "premium" && (
                                            <>
                                                <div className="date-fields">

                                                    <div className="form-group">
                                                        <label>
                                                            Premium Start
                                                        </label>

                                                        <input
                                                            type="date"
                                                            name="premium_start_date"
                                                            value={
                                                                form.premium_start_date
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>
                                                            Premium End
                                                        </label>

                                                        <input
                                                            type="date"
                                                            name="premium_end_date"
                                                            value={
                                                                form.premium_end_date
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                    </div>

                                                </div>

                                                <div className="form-group">
                                                    <label>
                                                        Membership Notes
                                                    </label>

                                                    <textarea
                                                        name="membership_notes"
                                                        value={
                                                            form.membership_notes
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Add notes about this premium membership..."
                                                        rows="4"
                                                    />
                                                </div>
                                            </>
                                        )}
                                </>
                            )}

                        </div>

                        {selectedUser.role !== "admin" && (
                            <div className="user-modal-actions">

                                <button
                                    className="cancel-button"
                                    onClick={closeUser}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="save-user-button"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
};

export default AdminUsers;