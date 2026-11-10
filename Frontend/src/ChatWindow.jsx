
import { useState, useContext, useEffect } from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { Mycontext } from "./MyContext.jsx";
import { SyncLoader } from "react-spinners";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        prevChats,
        setPrevChats,
        setNewChat,
        newChat
    } = useContext(Mycontext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);//set default as false

    const getReply = async () => {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        setNewChat(false);
        console.log("message", prompt, "threadId", currThreadId);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(
                "https://gpt-sigma.onrender.com/api/chat",
                options
            );

            if (!response.ok) {
                throw new Error("Failed to fetch reply");
            }

            const res = await response.json();
            console.log(res);
            setReply(res.reply);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Append new Chat to prevChats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => [
                ...prevChats,
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "model",
                    content: reply
                }
            ]);
        }

        setPrompt("");
    }, [reply]);

    const handleUserIconClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">

            {/* Navbar */}
            <div className="navbar">
                <span className="navbar-span">
                    SigmaGPT <i className="fa-solid fa-chevron-down"></i>
                </span>

                <div className="userIconDiv" onClick={handleUserIconClick}>
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                    <i className="fa-solid fa-sort-down"></i>
                </div>
                
            </div>

            {
                isOpen &&
                 <div className="dropDown">
                    <div className="dropDownItem"> <i class="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan </div>
                    <div className="dropDownItem"> <i class="fa-solid fa-gear"></i>Settings </div>
                    <div className="dropDownItem"> <i class="fa-solid fa-right-from-bracket"></i> Log out </div>    
                </div>
            }

            {/* Chat Messages - Scrollable Area */}
            <div className="chatMessages">
                <Chat />
                <SyncLoader color="#fff" loading={loading} />
            </div>

            {/* Chat Input */}
            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && getReply()
                        }
                    />

                    <div id="submit" onClick={getReply}>
                        <i className="fa-regular fa-paper-plane"></i>
                    </div>
                </div>

                <p className="info">
                    SigmaGPT can make mistakes. Check important info.
                    See Cookie Preferences.
                </p>
            </div>

        </div>
    );
}

export default ChatWindow;
