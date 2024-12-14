'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function CreateRestaurant() {
    const [restaurants, setRestaurants] = useState([]);
    const [restaurant_name, setRestaurantName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [opening_hours, setOpeningHours] = useState("");
    const [closing_hours, setClosingHours] = useState("");
    const [active, setRestaurantActive] = useState("");
    const router = useRouter();
    const openPopup = (username: string,password: string,restaurant_id: string) => {
        let newWindow=window.open('','name','height=200,width=150');
        let tmp = document.createElement("div");
        tmp.innerHTML = `<p>Restaurant created!</p><p>Username: ${username}</p><p>Password: ${password}</p><p>Restaurant ID: ${restaurant_id}</p>`;
        if (newWindow) {
            newWindow.document.body.appendChild(tmp);
        }
    }
    const handleCreateRestaurant = async () => {
        const body = {
            restaurant_name,
            address1,
            address2,
            city,
            state,
            zipcode,
            opening_hours,
            closing_hours,
            active,
        };

        fetch(
            "https://q54hakjlp7.execute-api.us-east-1.amazonaws.com/dev/createRestaurant",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        ) .then(function(response) {
            return response.json();

        }).then(function(data) {
            console.log(data);
            if (!data.error)  {
                openPopup(data.user_name, data.user_password, data.restaurant_id);
                router.push("/manager");
            }
            else {
                alert( "Failed to create restaurant.")
            }
        });
    };

    return (
        <div>
            <center><h1>Tables4U: Create Restaurant</h1></center>
            <br/>
            <h3>Enter Restaurant Details</h3>
            <br/>
            <br/>
            <input
                type="text"
                placeholder="Restaurant Name"
                value={restaurant_name}
                onChange={(e) => setRestaurantName(e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Address 1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Address 2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Zipcode"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Opening Hours (8:00)"
                value={opening_hours}
                onChange={(e) => setOpeningHours(e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Closing Hours (23:00)"
                value={closing_hours}
                onChange={(e) => setClosingHours(e.target.value)}
            /><br/>
            <br/><br/>
            <center>
                <button onClick={handleCreateRestaurant}>Create Restaurant</button>
            </center>

        </div>
    );
}
