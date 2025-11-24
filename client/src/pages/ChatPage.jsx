import React, { useMemo } from "react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import useViewport from "../hooks/useViewport";
import "./ChatPage.css";

const ChatPage = () => {
    const { user, selectedChat } = ChatState();
    const { width, isMobile } = useViewport();

    const gridTemplateColumns = useMemo(() => {
        if (isMobile) return "1fr";
        if (width <= 1024) return "320px minmax(0, 1fr)";
        if (width <= 1366) return "360px minmax(0, 1fr)";
        return "400px minmax(0, 1fr)";
    }, [isMobile, width]);

    const gridPadding = useMemo(() => {
        if (isMobile) return "0.25rem";
        if (width <= 1024) return "0.75rem";
        return "1.25rem";
    }, [isMobile, width]);

    const gridGap = useMemo(() => {
        if (isMobile) return "0";
        if (width <= 1024) return "0.75rem";
        return "1rem";
    }, [isMobile, width]);

    const gridHeight = useMemo(
        () => (isMobile ? "calc(100vh - 72px)" : "calc(100vh - 110px)"),
        [isMobile]
    );

    const listPaneClasses = [
        "chat-pane",
        "chat-pane--list",
        isMobile ? "chat-pane--mobile" : "",
        !isMobile || !selectedChat ? "chat-pane--active" : "",
        isMobile && selectedChat ? "chat-pane--hidden" : "",
    ]
        .filter(Boolean)
        .join(" ");

    const conversationPaneClasses = [
        "chat-pane",
        "chat-pane--conversation",
        isMobile ? "chat-pane--mobile" : "",
        !isMobile || selectedChat ? "chat-pane--active" : "",
        isMobile && !selectedChat ? "chat-pane--hidden" : "",
    ]
        .filter(Boolean)
        .join(" ");

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
            "--chat-grid-columns": gridTemplateColumns,
            "--chat-grid-padding": gridPadding,
            "--chat-grid-gap": gridGap,
            "--chat-grid-height": gridHeight
        }}>
            {user && <SideDrawer />}
            <div className="chat-page-grid">
                {user && (
                    <div className={listPaneClasses}>
                        <MyChats />
                    </div>
                )}

                {user && (
                    <div className={conversationPaneClasses}>
                        <ChatBox />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
