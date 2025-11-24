import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";

const ProfilePage = () => {
    const [name, setName] = useState("");
    const [pic, setPic] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [picLoading, setPicLoading] = useState(false);

    const { user, setUser } = ChatState();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }
        setName(user.name);
        setPic(user.pic);
        setEmail(user.email);
    }, [user, navigate]);

    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
            alert("Please Select an Image!");
            setPicLoading(false);
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "piyushproj");
            fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    // Ensure HTTPS URL
                    const imageUrl = data.url.toString().replace('http://', 'https://');
                    setPic(imageUrl);
                    console.log("Image uploaded successfully:", imageUrl);
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.error("Image upload error:", err);
                    alert("Failed to upload image. Please try again.");
                    setPicLoading(false);
                });
        } else {
            alert("Please Select an Image!");
            setPicLoading(false);
            return;
        }
    };

    const updateHandler = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            alert("Passwords Do Not Match");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // Only include password if it's being updated
            const updateData = {
                name,
                pic,
            };

            if (password && password.trim() !== "") {
                updateData.password = password;
            }

            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const { data } = await axios.put(
                `${API_URL}/api/user/profile`,
                updateData,
                config
            );

            alert("Profile Updated Successfully");
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Profile update error:", error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Error Occurred!";
            alert(errorMessage);
            setLoading(false);
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    if (!user) return null;

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, var(--bg-start) 0%, var(--bg-end) 100%)",
            padding: "2rem"
        }}>
            <div style={{
                maxWidth: "800px",
                margin: "0 auto"
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "2rem"
                }}>
                    <button
                        onClick={() => navigate("/chats")}
                        className="btn btn-ghost"
                        style={{
                            padding: "0.75rem",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}
                    >
                        <FaArrowLeft /> Back to Chats
                    </button>
                </div>

                {/* Profile Card */}
                <div className="glass-card" style={{
                    padding: "3rem",
                    borderRadius: "24px",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}>
                    <h1 className="gradient-text" style={{
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "3rem"
                    }}>
                        My Profile
                    </h1>

                    {/* Avatar Section */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "3rem"
                    }}>
                        <div style={{ position: "relative" }}>
                            <img
                                src={pic}
                                alt={name}
                                className="hover-lift"
                                style={{
                                    width: "10rem",
                                    height: "10rem",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "5px solid var(--primary-start)",
                                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                                }}
                            />
                            <label
                                htmlFor="profile-pic-upload"
                                style={{
                                    position: "absolute",
                                    bottom: "0.5rem",
                                    right: "0.5rem",
                                    background: "linear-gradient(135deg, var(--primary-start) 0%, var(--primary-end) 100%)",
                                    color: "white",
                                    width: "3rem",
                                    height: "3rem",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    transition: "all 0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <FaCamera size={18} />
                            </label>
                            <input
                                id="profile-pic-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => postDetails(e.target.files[0])}
                                style={{ display: "none" }}
                            />
                        </div>
                        {picLoading && (
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginTop: "1rem",
                                color: "var(--primary-start)"
                            }}>
                                <div className="spinner" style={{ width: "20px", height: "20px", borderWidth: "2px" }}></div>
                                Uploading...
                            </div>
                        )}
                    </div>

                    {/* Form */}
                    <form onSubmit={updateHandler} style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem"
                    }}>
                        <div>
                            <label className="form-label" style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                marginBottom: "0.5rem",
                                display: "block"
                            }}>
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{
                                    fontSize: "1rem",
                                    padding: "0.875rem 1.25rem"
                                }}
                            />
                        </div>

                        <div>
                            <label className="form-label" style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                marginBottom: "0.5rem",
                                display: "block"
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                disabled
                                style={{
                                    fontSize: "1rem",
                                    padding: "0.875rem 1.25rem",
                                    background: "rgba(0, 0, 0, 0.05)",
                                    cursor: "not-allowed"
                                }}
                            />
                        </div>

                        <div>
                            <label className="form-label" style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                marginBottom: "0.5rem",
                                display: "block"
                            }}>
                                New Password (Optional)
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Leave blank to keep current password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    fontSize: "1rem",
                                    padding: "0.875rem 1.25rem"
                                }}
                            />
                        </div>

                        <div>
                            <label className="form-label" style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                marginBottom: "0.5rem",
                                display: "block"
                            }}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{
                                    fontSize: "1rem",
                                    padding: "0.875rem 1.25rem"
                                }}
                            />
                        </div>

                        <div style={{
                            display: "flex",
                            gap: "1rem",
                            marginTop: "1rem"
                        }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: "1rem 2rem",
                                    fontSize: "1.05rem",
                                    fontWeight: "600"
                                }}
                            >
                                {loading ? (
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "0.5rem"
                                    }}>
                                        <div className="spinner" style={{
                                            width: "20px",
                                            height: "20px",
                                            borderWidth: "2px"
                                        }}></div>
                                        Updating...
                                    </div>
                                ) : "Update Profile"}
                            </button>

                            <button
                                type="button"
                                onClick={logoutHandler}
                                className="btn"
                                style={{
                                    flex: 1,
                                    padding: "1rem 2rem",
                                    fontSize: "1.05rem",
                                    fontWeight: "600",
                                    background: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
                                    color: "white",
                                    border: "none"
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
