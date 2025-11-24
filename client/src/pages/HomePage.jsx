import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import "../App.css";

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) navigate("/chats");
    }, [navigate]);

    const [showLogin, setShowLogin] = React.useState(true);

    return (
        <div className="App items-center justify-center" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Circles */}
            <div style={{
                position: 'absolute',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                top: '-250px',
                left: '-250px',
                animation: 'float 20s ease-in-out infinite'
            }}></div>
            <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                bottom: '-200px',
                right: '-200px',
                animation: 'float 15s ease-in-out infinite reverse'
            }}></div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -50px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
      `}</style>

            <div className="glass-card fade-in" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '2.5rem',
                margin: '1rem',
                zIndex: 1
            }}>
                {/* Logo/Title */}
                <div className="text-center mb-4" style={{ marginBottom: '2rem' }}>
                    <h1 className="gradient-text" style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.5px'
                    }}>
                        Talk-A-Tive
                    </h1>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem'
                    }}>
                        Connect with friends instantly
                    </p>
                </div>

                {/* Tab Switcher */}
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginBottom: '2rem',
                    background: 'rgba(102, 126, 234, 0.08)',
                    padding: '0.5rem',
                    borderRadius: '16px'
                }}>
                    <button
                        className={`w-full py-2 rounded-lg transition-all duration-300 ${showLogin ? "btn-primary" : "btn-ghost"
                            }`}
                        onClick={() => setShowLogin(true)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '0.95rem'
                        }}
                    >
                        Login
                    </button>
                    <button
                        className={`w-full py-2 rounded-lg transition-all duration-300 ${!showLogin ? "btn-primary" : "btn-ghost"
                            }`}
                        onClick={() => setShowLogin(false)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '0.95rem'
                        }}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form Content */}
                <div className="slide-in" key={showLogin ? 'login' : 'signup'}>
                    {showLogin ? <Login /> : <Signup />}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
