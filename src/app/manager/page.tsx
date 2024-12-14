'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function ManagerDashboard() {
    const [userInfo, setUserInfo] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const router = useRouter();

    const handleActivateRestaurant = async (restaurantId: string) => {
        
        fetch(
            "https://q54hakjlp7.execute-api.us-east-1.amazonaws.com/dev/activateRestaurant",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ restaurant_id: restaurantId }),
            }
        ) .then(function(response) {
            return response.json();

        }).then(function(data) {
            console.log(data);
            if (!data.error)  {
                alert( "Activated restaurant.")
                router.push("/manager");
            }
            else {
                alert( "Failed to activate restaurant.")
            }
        });
    };
    useEffect(() => {
        if (! restaurants) {
            fetch("https://q54hakjlp7.execute-api.us-east-1.amazonaws.com/dev/listAdminRestaurants")
                .then((res) => res.json())
                .then(setRestaurants);
        }
    }, []);

    useEffect(() => {
        if (! restaurants) {
            fetch("https://q54hakjlp7.execute-api.us-east-1.amazonaws.com/dev/createRestaurant")
            .then((res) => res.json())
            .then((data) => setUserInfo(data));
        }
    }, []);

    

    return (
        <div>
            <h1>Manager Dashboard</h1>
            <button onClick={() => router.push("/")}>Logout</button>
            <h2>Your Managed Restaurants</h2>
            {userInfo.map((user_info: any) => (
            <div key={user_info.restaurant_id}>
                <h1>Username: {user_info.username}</h1>
                <h2>Password: {user_info.password}</h2>
            </div>
        ))}
        
            
            <button onClick={() => handleActivateRestaurant}>Activate</button>
            
            <br />  <br />
            <h1> </h1>
            <button onClick={() => router.push("openFuture")}>Open Future Day</button>
            <br />  <br />
            <h1> </h1>
            <button onClick={() => router.push("closeFuture")}>Close Future Day</button>
            <br />  <br />
            <h1> </h1>
            <button onClick={() => router.push("ReviewDaysAvailability")}>Review Days Availability</button>
        </div>
        
    );
};
