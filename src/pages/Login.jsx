import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!form.email || !form.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/auth/login`,

                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed."
                );
            }

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Save logged-in user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Send admin to admin dashboard
            if (data.user.role === "admin") {
                navigate("/admin");
            } else {
                // Normal users go to homepage
                navigate("/");
            }

        } catch (err) {
            console.error("Login error:", err);

            setError(
                err.message ||
                "Unable to login. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>Welcome Back</h1>

                    <p>
                        Login to your NookNook account
                    </p>

                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            disabled={loading}
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            disabled={loading}
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <div className="auth-footer">

                    <p>
                        Don't have an account?
                    </p>

                    <Link to="/register">
                        Create Account
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;