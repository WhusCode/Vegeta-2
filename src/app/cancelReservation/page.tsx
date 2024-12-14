'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function CancelReservation() {
    const [booking_id, setBookingId] = useState("");
    const router = useRouter();

    const handleCancelReservation = async () => {
        const body = {
            booking_id,
        };

        fetch(
            "https://q54hakjlp7.execute-api.us-east-1.amazonaws.com/dev/cancelReservation",
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
            if (data.success) {
                alert("Reservation successfully canceled!");
                router.push("/confirmation");
            } else {
                alert("Failed to cancel reservation: " + data.error);
            }
        })
        .catch(function(err) {
            console.error(err);
            alert("An error occurred while canceling the reservation.");
        });
    };

    return (
        <div>
            <center><h1>Tables4U: Cancel Reservation</h1></center>
            <br/>
            <h3>Enter Booking ID</h3>
            <br/><br/>
            <input
                type="text"
                placeholder="Booking ID"
                value={booking_id}
                onChange={(e) => setBookingId(e.target.value)}
            /><br/><br/>
            <center>
                <button onClick={handleCancelReservation}>Cancel Reservation</button>
            </center>
        </div>
    );
}
