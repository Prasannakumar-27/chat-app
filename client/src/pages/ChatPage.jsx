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
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {user && <SideDrawer />}
            <div className="chat-page-grid" style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : window.innerWidth <= 1024 ? '1fr 1.5fr' : '1fr 2fr',
                gap: isMobile ? '0' : window.innerWidth <= 1024 ? '0.75rem' : '1rem',
                padding: isMobile ? '0.5rem' : window.innerWidth <= 1024 ? '0.75rem' : '1rem',
                height: 'calc(100vh - 100px)',
                maxWidth: window.innerWidth <= 1024 ? '100%' : window.innerWidth <= 1440 ? '1280px' : '1400px',
                margin: '0 auto',
                width: '100%',
                overflow: 'hidden'
            }}>
                {/* On mobile: show MyChats only when no chat is selected */}
                {user && (!isMobile || !selectedChat) && (
                    <div style={{
                        display: isMobile && selectedChat ? 'none' : 'flex',
                        height: '100%',
                        overflow: 'hidden'
                    }}>
                        <MyChats />
                    </div>
                )}

                {/* On mobile: show ChatBox only when a chat is selected */}
                {user && (!isMobile || selectedChat) && (
                    <div style={{
                        display: isMobile && !selectedChat ? 'none' : 'flex',
                        height: '100%',
                        overflow: 'hidden'
                    }}>
                        <ChatBox />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
