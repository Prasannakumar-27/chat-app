import React, { useState, useEffect } from "react";
import { FaEye, FaTimes } from "react-icons/fa";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";

const ProfileModal = ({ user, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [pic, setPic] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { user: loggedUser, setUser } = ChatState();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setPic(user.pic);
        }
    }, [user]);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            alert("Please Select an Image!");
            setLoading(false);
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
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            alert("Please Select an Image!");
            setLoading(false);
            return;
        }
    };

    const updateHandler = async () => {
        if (password && password !== confirmPassword) {
            alert("Passwords Do Not Match");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${loggedUser.token}`,
                },
            };

            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const { data } = await axios.put(
                `${API_URL}/api/user/profile`,
                {
                    name,
                    pic,
                    password,
                },
                config
            );

            alert("Profile Updated Successfully");
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            closeModal();
        } catch (error) {
            alert("Error Occurred!");
            setLoading(false);
        }
    };

    return (
        <>
            {children ? (
                <span onClick={openModal}>{children}</span>
            ) : (
                <button className="btn btn-ghost" onClick={openModal}>
                    <FaEye />
                </button>
            )}

            {isOpen && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: 'blur(5px)',
                    padding: '2rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 255, 0.98) 100%)',
                        padding: "2.5rem",
                        borderRadius: "24px",
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        width: "100%",
                        maxWidth: "600px",
                        position: "relative",
                        zIndex: 10000,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        <button
                            onClick={closeModal}
                            style={{
                                position: "absolute",
                                top: "1.25rem",
                                right: "1.25rem",
                                border: "none",
                                background: "rgba(0, 0, 0, 0.05)",
                                cursor: "pointer",
                                fontSize: "1.25rem",
                                padding: '0.625rem',
                                borderRadius: '10px',
                                zIndex: 10001,
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = "rgba(0, 0, 0, 0.1)"}
                            onMouseOut={(e) => e.target.style.background = "rgba(0, 0, 0, 0.05)"}
                        >
                            <FaTimes />
                        </button>

                        <h2 className="gradient-text" style={{
                            fontSize: "2rem",
                            fontWeight: "bold",
                            textAlign: "center",
                            marginBottom: "2rem",
                            paddingRight: '2.5rem'
                        }}>
                            {loggedUser._id === user._id ? "Edit Profile" : user.name}
                        </h2>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1.5rem"
                        }}>
                            <img
                                src={pic || user.pic}
                                alt={user.name}
                                className="hover-lift"
                                style={{
                                    width: "8rem",
                                    height: "8rem",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "4px solid var(--primary-start)",
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                }}
                            />

                            {loggedUser._id === user._id ? (
                                <div style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1.25rem"
                                }}>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <label className="form-label" style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <label className="form-label" style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Change Profile Picture</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="form-input"
                                            onChange={(e) => postDetails(e.target.files[0])}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                        {loading && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginTop: '0.5rem',
                                                fontSize: '0.95rem',
                                                color: 'var(--primary-start)'
                                            }}>
                                                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                                                Uploading...
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <label className="form-label" style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>New Password (Optional)</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            placeholder="Leave blank to keep current"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <label className="form-label" style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                                        />
                                    </div>

                                    <button
                                        className="btn btn-primary"
                                        onClick={updateHandler}
                                        disabled={loading}
                                        style={{
                                            width: "100%",
                                            marginTop: "1.5rem",
                                            padding: '0.875rem 1.5rem',
                                            fontSize: '1.05rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {loading ? (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <div className="spinner" style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderWidth: '2px'
                                                }}></div>
                                                Updating...
                                            </div>
                                        ) : "Update Profile"}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ textAlign: "center", padding: '1rem' }}>
                                    <p style={{
                                        fontSize: "1.125rem",
                                        color: "var(--text-secondary)",
                                        wordBreak: 'break-word'
                                    }}>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>Email:</strong><br />
                                        {user.email}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileModal;
