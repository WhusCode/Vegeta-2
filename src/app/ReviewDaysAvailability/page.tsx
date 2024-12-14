'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function ReviewDaysAvailability() {
    const [restaurant_id, setRestaurantId] = useState("");
    const [date, setDate] = useState("");
    const [availability, setAvailability] = useState<any[]>([]);
    const router = useRouter();

    const handleReviewAvailability = async () => {
        const body = {
            restaurant_id,
            date,
        };

        fetch(
            "https://q54hakjlp7.execute-api.us-east-1.amazonaws.com/dev/ReviewDaysAvailability",
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
                setAvailability(data);
            } else {
                alert("Failed to fetch availability: " + data.error);
            }
        })
        .catch(function(err) {
            console.error(err);
            alert("An error occurred while fetching availability.");
        });
    };

    return (
        <div>
            <center><h1>Tables4U: Review Days Availability</h1></center>
            <br/>
            <h3>Enter Availability Details</h3>
            <br/><br/>
            <input
                type="number"
                placeholder="Restaurant ID"
                value={restaurant_id}
                onChange={(e) => setRestaurantId(e.target.value)}
            /><br/>
            <input
                type="date"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            /><br/><br/>
            <center>
                <button onClick={handleReviewAvailability}>Check Availability</button>
            </center>
            <br/>
            {availability.length > 0 && (
                <div>
                    <h3>Available Tables:</h3>
                    <ul>
                        {availability.map((table, index) => (
                            <li key={index}>
                                Table Number: {table.table_number}, Seats: {table.number_of_seats}, Available: {table.table_available ? 'Yes' : 'No'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
