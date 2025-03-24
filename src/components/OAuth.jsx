import { useState } from "react";

const Auth = ({ isLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? "http://localhost:5000/api/user/login" : "http://localhost:5000/api/user/register";
        const body = isLogin ? { email, password } : { username, email, password };

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        alert(data.message);
        if (data.token) localStorage.setItem("token", data.token);
    };

    return (
        <div>
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
        </div>
    );
};

export default Auth;
