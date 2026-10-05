import React, { useState } from "react";
import "./AdminDashboard.css";
import AdminPlaces from "./AdminPlaces";
import AdminCategories from "./AdminCategories";
import AdminPlaceCategories from "./AdminPlaceCategories";
import AdminVacants from "./AdminVacants";
import AdminImages from "./AdminImages";
import AdminUsers from "./AdminUsers";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("Dashboard");

    const menuItems = [
        { name: "Dashboard", icon: "📊" },
        { name: "Places", icon: "📍" },
        { name: "Categories", icon: "🏷️" },
        { name: "Amenities", icon: "✨" },
        { name: "Place Categories", icon: "🔗" },
        { name: "Vacants", icon: "🏠" },
        { name: "Images", icon: "🖼️" },
        { name: "Users", icon: "👥" },
        { name: "Premium Users", icon: "⭐" }
    ];
    const handleMenuClick = (name) => {
        setActiveMenu(name);
        setSidebarOpen(false);
    };

    return (
        <div className="admin-layout">

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="admin-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`admin-sidebar ${
                    sidebarOpen ? "sidebar-open" : ""
                }`}
            >

                <div className="admin-logo">
                    <div className="admin-logo-icon">N</div>

                    <div>
                        <h2>NookNook</h2>
                        <span>ADMIN PANEL</span>
                    </div>
                </div>

                <nav className="admin-navigation">

                    <p className="menu-title">MAIN MENU</p>

                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            className={`admin-menu-item ${
                                activeMenu === item.name ? "active" : ""
                            }`}
                            onClick={() => handleMenuClick(item.name)}
                        >
                            <span className="menu-icon">
                                {item.icon}
                            </span>

                            <span>{item.name}</span>
                        </button>
                    ))}

                    <p className="menu-title menu-title-bottom">
                        SYSTEM
                    </p>

                    <button
                        className="admin-menu-item"
                        onClick={() => alert("Settings coming next")}
                    >
                        <span className="menu-icon">⚙️</span>
                        <span>Settings</span>
                    </button>

                    <button
                        className="admin-menu-item logout-item"
                        onClick={() =>
                            alert(
                                "Logout will be connected to authentication"
                            )
                        }
                    >
                        <span className="menu-icon">🚪</span>
                        <span>Logout</span>
                    </button>

                </nav>

                <div className="admin-sidebar-footer">

                    <div className="admin-user-avatar">
                        A
                    </div>

                    <div className="admin-user-info">
                        <strong>Administrator</strong>
                        <span>System Admin</span>
                    </div>

                </div>

            </aside>

            {/* MAIN AREA */}
            <main className="admin-main">

                {/* TOP BAR */}
                <header className="admin-topbar">

                    <button
                        className="mobile-menu-button"
                        onClick={() => setSidebarOpen(true)}
                    >
                        ☰
                    </button>

                    <div className="admin-page-heading">
                        <h1>{activeMenu}</h1>

                        <p>
                            Manage and control your NookNook platform
                        </p>
                    </div>

                    <div className="admin-topbar-actions">

                        <button className="notification-button">
                            🔔
                            <span className="notification-dot"></span>
                        </button>

                        <div className="topbar-admin">

                            <div className="topbar-avatar">
                                A
                            </div>

                            <div>
                                <strong>Admin</strong>
                                <span>Administrator</span>
                            </div>

                        </div>

                    </div>

                </header>

                {/* CONTENT */}
                <section className="admin-content">

                    {activeMenu === "Places" ? (
                        <AdminPlaces />
                    ) : activeMenu === "Categories" ? (
                        <AdminCategories />
                    ) : activeMenu === "Place Categories" ? (
                        <AdminPlaceCategories />
                    ) :
                        activeMenu === "Vacants" ? (
                            <AdminVacants />
                        ) :
                            activeMenu === "Images" ? (
                                <AdminImages />
                            ) :
                                activeMenu === "Users" ? (
                                    <AdminUsers />
                                ) :(

                        <>

                            {/* WELCOME */}
                            <div className="admin-welcome">

                                <div>

                                    <span className="welcome-label">
                                        NOOKNOOK CONTROL CENTER
                                    </span>

                                    <h2>
                                        Welcome back, Administrator 👋
                                    </h2>

                                    <p>
                                        Manage properties, users, locations
                                        and premium content from one place.
                                    </p>

                                </div>

                                <div className="welcome-decoration">
                                    🏠
                                </div>

                            </div>

                            {/* STATISTICS */}
                            <div className="admin-stat-grid">

                                <div className="admin-stat-card">

                                    <div className="stat-icon">
                                        🏠
                                    </div>

                                    <div className="stat-information">

                                        <span>
                                            Total Properties
                                        </span>

                                        <strong>1</strong>

                                        <small>
                                            Properties listed
                                        </small>

                                    </div>

                                </div>

                                <div className="admin-stat-card">

                                    <div className="stat-icon">
                                        📍
                                    </div>

                                    <div className="stat-information">

                                        <span>
                                            Places
                                        </span>

                                        <strong>3</strong>

                                        <small>
                                            Active locations
                                        </small>

                                    </div>

                                </div>

                                <div className="admin-stat-card">

                                    <div className="stat-icon">
                                        👥
                                    </div>

                                    <div className="stat-information">

                                        <span>
                                            Users
                                        </span>

                                        <strong>2</strong>

                                        <small>
                                            Registered users
                                        </small>

                                    </div>

                                </div>

                                <div className="admin-stat-card">

                                    <div className="stat-icon">
                                        ⭐
                                    </div>

                                    <div className="stat-information">

                                        <span>
                                            Premium Users
                                        </span>

                                        <strong>1</strong>

                                        <small>
                                            Active premium users
                                        </small>

                                    </div>

                                </div>

                            </div>

                            {/* QUICK ACTIONS */}
                            <div className="admin-section-header">

                                <div>
                                    <h2>Quick Actions</h2>

                                    <p>
                                        Common administrative tasks
                                    </p>
                                </div>

                            </div>

                            <div className="quick-actions">

                                <button
                                    onClick={() =>
                                        handleMenuClick("Places")
                                    }
                                    className="quick-action-card"
                                >
                                    <span>📍</span>

                                    <strong>
                                        Add Place
                                    </strong>

                                    <small>
                                        Add a new location
                                    </small>
                                </button>

                                <button
                                    onClick={() =>
                                        handleMenuClick("Categories")
                                    }
                                    className="quick-action-card"
                                >
                                    <span>🏷️</span>

                                    <strong>
                                        Add Category
                                    </strong>

                                    <small>
                                        Create house type
                                    </small>
                                </button>

                                <button
                                    onClick={() =>
                                        handleMenuClick("Properties")
                                    }
                                    className="quick-action-card"
                                >
                                    <span>🏠</span>

                                    <strong>
                                        Add Property
                                    </strong>

                                    <small>
                                        List a vacant property
                                    </small>
                                </button>

                                <button
                                    onClick={() =>
                                        handleMenuClick("Amenities")
                                    }
                                    className="quick-action-card"
                                >
                                    <span>✨</span>

                                    <strong>
                                        Add Amenity
                                    </strong>

                                    <small>
                                        Add property feature
                                    </small>
                                </button>

                            </div>

                            {/* RECENT ACTIVITY */}
                            <div className="admin-section-header activity-heading">

                                <div>

                                    <h2>
                                        Recent Activity
                                    </h2>

                                    <p>
                                        Latest changes on your platform
                                    </p>

                                </div>

                            </div>

                            <div className="activity-card">

                                <div className="activity-item">

                                    <div className="activity-icon">
                                        🏠
                                    </div>

                                    <div>
                                        <strong>
                                            Property added
                                        </strong>

                                        <p>
                                            Modern Single Room - Kilifi
                                        </p>
                                    </div>

                                    <span>
                                        Recently
                                    </span>

                                </div>

                                <div className="activity-item">

                                    <div className="activity-icon">
                                        ⭐
                                    </div>

                                    <div>
                                        <strong>
                                            Premium user updated
                                        </strong>

                                        <p>
                                            Test User was given premium access
                                        </p>
                                    </div>

                                    <span>
                                        Recently
                                    </span>

                                </div>

                                <div className="activity-item">

                                    <div className="activity-icon">
                                        ✨
                                    </div>

                                    <div>
                                        <strong>
                                            Amenities updated
                                        </strong>

                                        <p>
                                            Six property amenities are available
                                        </p>
                                    </div>

                                    <span>
                                        Recently
                                    </span>

                                </div>

                            </div>

                        </>

                    )}

                </section>

            </main>

        </div>
    );
};

export default AdminDashboard;