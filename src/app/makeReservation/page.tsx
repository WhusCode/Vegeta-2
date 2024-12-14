'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function MakeReservation() {
    const [booking_date, setBookingDate] = useState("");
    const [booking_time, setBookingTime] = useState("");
    const [restaurant_id, setRestaurantId] = useState("");
    const [table_number, setTableNumber] = useState("");
    const [number_of_seats, setNumberOfSeats] = useState("");
    const [email_id, setEmailId] = useState("");
    const [confirmation_code, setConfirmationCode] = useState("");
    const router = useRouter();

    const handleMakeReservation = async () => {
        const body = {
            booking_date,
            booking_time,
            restaurant_id,
            table_number,
            number_of_seats,
            email_id,
            confirmation_code,
        };

        fetch(
            "https://q54hakjlp7.execute-api.us-east-1.amazonaws.com/dev/makeReservation",
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
                alert("Reservation successfully created!\nBooking ID: " + data.booking_id);
                router.push("/confirmation");
            } else {
                alert("Failed to make reservation.");
            }
        });
    };

    return (
        <div>
            <center><h1>Tables4U: Make Reservation</h1></center>
            <br/>
            <h3>Enter Reservation Details</h3>
            <br/><br/>
            <input
                type="date"
                placeholder="Booking Date"
                value={booking_date}
                onChange={(e) => setBookingDate(e.target.value)}
            /><br/>
            <input
                type="time"
                placeholder="Booking Time (e.g., 18:00)"
                value={booking_time}
                onChange={(e) => setBookingTime(e.target.value)}
            /><br/>
            <input
                type="number"
                placeholder="Restaurant ID"
                value={restaurant_id}
                onChange={(e) => setRestaurantId(e.target.value)}
            /><br/>
            <input
                type="number"
                placeholder="Table Number"
                value={table_number}
                onChange={(e) => setTableNumber(e.target.value)}
            /><br/>
            <input
                type="number"
                placeholder="Number of Seats"
                value={number_of_seats}
                onChange={(e) => setNumberOfSeats(e.target.value)}
            /><br/>
            <input
                type="email"
                placeholder="Email ID"
                value={email_id}
                onChange={(e) => setEmailId(e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Confirmation Code (6-digit)"
                value={confirmation_code}
                onChange={(e) => setConfirmationCode(e.target.value)}
            /><br/><br/>
            <center>
                <button onClick={handleMakeReservation}>Make Reservation</button>
            </center>
        </div>
    );
}
