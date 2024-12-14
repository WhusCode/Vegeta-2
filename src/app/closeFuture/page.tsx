'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function CloseFutureDay() {
    const [closing_date, setClosingDate] = useState("");
    const [restaurant_id, setRestaurantId] = useState("");
    const router = useRouter();

    const handleCloseFutureDay = async () => {
        const body = {
            closing_date,
            restaurant_id,
        };

        fetch(
            "https://q54hakjlp7.execute-api.us-east-1.amazonaws.com/dev/closeFuture",
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
            if (data === "worked") {
                alert("Day successfully closed for the restaurant!");
                router.push("/confirmation");
            } else {
                alert("Failed to close day: " + data.error);
            }
        })
        .catch(function(err) {
            console.error(err);
            alert("An error occurred while closing the day.");
        });
    };

    return (
        <div>
            <center><h1>Tables4U: Close Future Day</h1></center>
            <br/>
            <h3>Enter Day and Restaurant Details</h3>
            <br/><br/>
            <input
                type="date"
                placeholder="Closing Date"
                value={closing_date}
                onChange={(e) => setClosingDate(e.target.value)}
            /><br/>
            <input
                type="number"
                placeholder="Restaurant ID"
                value={restaurant_id}
                onChange={(e) => setRestaurantId(e.target.value)}
            /><br/><br/>
            <center>
                <button onClick={handleCloseFutureDay}>Close Day</button>
            </center>
        </div>
    );
}
