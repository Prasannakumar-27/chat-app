import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
    const { user, selectedChat } = ChatState();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!user) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--bg-start) 0%, var(--bg-end) 100%)'
            }}>
                <div className="spinner" style={{ width: '50px', height: '50px', borderWidth: '4px' }}></div>
            </div>
        );
    }

    return (
        <div className="chat-page-container" style={{
            background: 'var(--gradient-bg)',
            minHeight: '100vh',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {user && <SideDrawer />}
            <div className="chat-page-grid" style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : window.innerWidth <= 1024 ? '350px 1fr' : '380px 1fr',
                gap: isMobile ? '0' : '1rem',
                padding: isMobile ? '0' : '1rem',
                height: isMobile ? 'calc(100vh - 80px)' : 'calc(100vh - 100px)',
                maxWidth: '100%',
                margin: '0 auto',
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Telegram-style slide animation for mobile */}
                {user && (
                    <div style={{
                        display: isMobile && selectedChat ? 'none' : 'flex',
                        height: '100%',
                        overflow: 'hidden',
                        transform: isMobile && selectedChat ? 'translateX(-100%)' : 'translateX(0)',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: isMobile ? 'absolute' : 'relative',
                        width: isMobile ? '100%' : 'auto',
                        zIndex: isMobile && !selectedChat ? 2 : 1
                    }}>
                        <MyChats />
                    </div>
                )}

                {/* Chat window with slide-in animation */}
                {user && (
                    <div style={{
                        display: isMobile && !selectedChat ? 'none' : 'flex',
                        height: '100%',
                        overflow: 'hidden',
                        transform: isMobile && selectedChat ? 'translateX(0)' : isMobile ? 'translateX(100%)' : 'translateX(0)',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: isMobile ? 'absolute' : 'relative',
                        width: isMobile ? '100%' : 'auto',
                        zIndex: isMobile && selectedChat ? 2 : 1
                    }}>
                        <ChatBox />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
