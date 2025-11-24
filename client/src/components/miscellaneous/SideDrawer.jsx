import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { FaSearch, FaTimes } from "react-icons/fa";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { user, setSelectedChat, chats, setChats } = ChatState();
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search) {
            alert("Please Enter something in search");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const { data } = await axios.get(`${API_URL}/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert("Error Occurred!");
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const { data } = await axios.post(`${API_URL}/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            setIsSearchOpen(false);
        } catch (error) {
            alert("Error fetching the chat");
            setLoadingChat(false);
        }
    };

    return (
        <>
            <div className="glass-card side-drawer-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: window.innerWidth <= 640 ? '0.75rem 1rem' : '1rem 1.5rem',
                margin: window.innerWidth <= 640 ? '0.5rem 0.5rem 0 0.5rem' : '1rem 1rem 0 1rem',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: window.innerWidth <= 640 ? '16px' : '20px',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative',
                zIndex: 100,
                gap: '0.5rem',
                flexWrap: 'wrap'
            }}>
                <button
                    className="btn btn-ghost flex items-center gap-2 hover-lift"
                    onClick={() => setIsSearchOpen(true)}
                    style={{ padding: window.innerWidth <= 640 ? '0.5rem 0.75rem' : '0.625rem 1rem' }}
                >
                    <FaSearch style={{ color: 'var(--primary-start)' }} />
                    <span className="mobile-hide" style={{ fontWeight: '500' }}>Search User</span>
                </button>

                <h1 className="gradient-text" style={{
                    fontSize: window.innerWidth <= 640 ? '1.25rem' : window.innerWidth <= 1024 ? '1.5rem' : '1.75rem',
                    fontWeight: '700',
                    letterSpacing: '-0.5px'
                }}>
                    Talk-A-Tive
                </h1>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-2 btn-ghost p-2 rounded-lg hover-lift profile-button"
                        style={{
                            padding: "0.5rem",
                            borderRadius: "12px",
                            transition: "all 0.2s",
                            minWidth: '44px',
                            minHeight: '44px'
                        }}
                    >
                        <img
                            src={user.pic}
                            alt={user.name}
                            style={{
                                width: window.innerWidth <= 640 ? "36px" : "40px",
                                height: window.innerWidth <= 640 ? "36px" : "40px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: '3px solid var(--primary-start)',
                                boxShadow: 'var(--shadow-md)'
                            }}
                        />
                    </button>
                </div>
            </div>

            {isSearchOpen && (
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
                    padding: window.innerWidth <= 640 ? '1rem' : '2rem'
                }}>
                    <div className="search-modal" style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 255, 0.98) 100%)',
                        padding: window.innerWidth <= 640 ? '1.5rem' : '2.5rem',
                        borderRadius: window.innerWidth <= 640 ? '20px' : '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        width: "100%",
                        maxWidth: window.innerWidth <= 640 ? '100%' : '600px',
                        position: "relative",
                        zIndex: 10000,
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        <button
                            onClick={() => setIsSearchOpen(false)}
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
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '2rem',
                            paddingRight: '2.5rem'
                        }}>
                            Search Users
                        </h2>

                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <input
                                placeholder="Search by name or email"
                                className="form-input"
                                style={{ flex: 1, fontSize: '1rem', padding: '0.75rem 1rem' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button onClick={handleSearch} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                                Go
                            </button>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <div style={{ flex: 1, overflowY: "auto", display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {searchResult?.map((user) => (
                                    <div
                                        key={user._id}
                                        onClick={() => accessChat(user._id)}
                                        className="hover-lift"
                                        style={{
                                            cursor: "pointer",
                                            background: 'rgba(139, 92, 246, 0.05)',
                                            padding: "1rem 1.25rem",
                                            borderRadius: "16px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                            transition: 'all 0.3s ease',
                                            border: '1px solid rgba(139, 92, 246, 0.1)'
                                        }}
                                    >
                                        <img src={user.pic} alt={user.name} style={{
                                            width: "3rem",
                                            height: "3rem",
                                            borderRadius: "50%",
                                            border: '2px solid var(--primary-start)',
                                            objectFit: 'cover'
                                        }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '1rem' }}>
                                                {user.name}
                                            </p>
                                            <p style={{ fontSize: "0.875rem", color: 'var(--text-secondary)' }}>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {loadingChat && (
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                <span style={{ color: 'var(--text-secondary)' }}>Accessing Chat...</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SideDrawer;
