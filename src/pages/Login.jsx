import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
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

        if (!form.email || !form.password) {
            setError("Please enter your email and password.");
            return;
        }

        /*
         * TEMPORARY LOGIN
         *
         * Backend authentication will be connected later.
         */

        console.log("Login:", form);

        navigate("/");
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
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                    >
                        Login
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