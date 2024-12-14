'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation';


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const router = useRouter();

    //check whether the user logging in is an admin, manager, or a consumer
    const handleLogin = async () => {
        let endpoint = "loginRestaurant";
        let body = { username, password };

        const response = await fetch(
            `https://q54hakjlp7.execute-api.us-east-1.amazonaws.com/dev/${endpoint}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );

        const d = await response.json();

        // check if login is successful
        // if yes, check the role and redirect to proper url.
        if (response.ok) {
            if (d.role === 1) {
                router.push("admin");
            } else if (d.role == 2) {
                router.push("manager");
            } else {
                router.push("consumer");
            }
        } else {
            router.push("createRestaurant");
        }
    };

    

    //frontend for login page
    return (
        <div>
            <h1>Tables4U: Login Page</h1>
            <input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <h1>-------------------------------------------------------------------------</h1>
            <button onClick={handleLogin}>Login</button> <br /> <br /> <button onClick={() => router.push("createRestaurant")}>Create Account</button>
            <br />  <br />
            <h1> </h1>
            <a href="consumer">Consumer Page</a>
        </div>
    );
};
  