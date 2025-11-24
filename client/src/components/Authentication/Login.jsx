import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            alert("Please Fill all the Fields");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const { data } = await axios.post(
                `${API_URL}/api/user/login`,
                { email, password },
                config
            );
            alert("Login Successful");
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            alert("Error Occurred: " + (error.response?.data?.message || error.message));
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="form-input"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="form-label">Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    className="form-input"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </div>
            <button
                className="btn btn-primary"
                onClick={submitHandler}
                disabled={loading}
                style={{ marginTop: '0.5rem' }}
            >
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                        Logging in...
                    </div>
                ) : "Login"}
            </button>
            <button
                className="btn btn-danger"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
                style={{ marginTop: '0.25rem' }}
            >
                Get Guest Credentials
            </button>
        </div>
    );
};

export default Login;
