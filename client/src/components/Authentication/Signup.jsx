import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            alert("Please Fill all the Fields");
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            alert("Passwords Do Not Match");
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user",
                {
                    name,
                    email,
                    password,
                    pic,
                },
                config
            );
            alert("Registration Successful");
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            alert("Error Occurred: " + error.response.data.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="form-group">
                <label className="form-label">Name</label>
                <input
                    type="text"
                    placeholder="Enter your name"
                    className="form-input"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="form-input"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="form-label">Password</label>
                <input
                    type="password"
                    placeholder="Create a password"
                    className="form-input"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                    type="password"
                    placeholder="Confirm your password"
                    className="form-input"
                    onChange={(e) => setConfirmpassword(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="form-label">Profile Picture (Optional)</label>
                <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={(e) => postDetails(e.target.files[0])}
                    style={{ padding: '0.625rem 1rem' }}
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
                        Signing up...
                    </div>
                ) : "Sign Up"}
            </button>
        </div>
    );
};

export default Signup;
