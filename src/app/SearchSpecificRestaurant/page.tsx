'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function SearchSpecificRestaurant() {
    const [restaurant_name, setRestaurantName] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const router = useRouter();

    const handleSearchRestaurant = async () => {
        const body = {
            restaurant_name,
        };

        fetch(
            "https://q54hakjlp7.execute-api.us-east-1.amazonaws.com/dev/SearchSpecificRestaurant",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        )
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            if (!data.error) {
                setResults(data);
            } else {
                alert("Failed to fetch restaurant: " + data.error);
            }
        })
        .catch(function(err) {
            console.error(err);
            alert("An error occurred while fetching restaurant.");
        });
    };

    return (
        <div>
            <center><h1>Tables4U: Search Specific Restaurant</h1></center>
            <br/>
            <h3>Enter Restaurant Name</h3>
            <br/><br/>
            <input
                type="text"
                placeholder="Restaurant Name"
                value={restaurant_name}
                onChange={(e) => setRestaurantName(e.target.value)}
            /><br/><br/>
            <center>
                <button onClick={handleSearchRestaurant}>Search Restaurant</button>
            </center>
            <br/>
            {results.length > 0 && (
                <div>
                    <h3>Search Results:</h3>
                    <ul>
                        {results.map((restaurant, index) => (
                            <li key={index}>
                                Restaurant ID: {restaurant.restaurant_id}, Name: {restaurant.restaurant_name}, Address: {restaurant.address1}, {restaurant.city}, {restaurant.state}, {restaurant.zipcode}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
