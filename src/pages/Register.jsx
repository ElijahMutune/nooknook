import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setError("");

        if (
            !form.name ||
            !form.email ||
            !form.phone ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        /*
         * TEMPORARY
         *
         * Later this will send the information
         * to the backend API.
         */

        console.log("Registration:", form);

        navigate("/login");
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">
                    <h1>Create Account</h1>

                    <p>
                        Create your NookNook account
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Full Name</label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>

                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="e.g. 0712345678"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                    >
                        Create Account
                    </button>

                </form>

                <div className="auth-footer">

                    <p>
                        Already have an account?
                    </p>

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;