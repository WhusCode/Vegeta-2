'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function ConsumerDashboard() {
    const [restaurants, setRestaurants] = useState([]);
    const [availableTables, setAvailableTables] = useState([]); // State for restaurants with available tables
    const router = useRouter();

    useEffect(() => {
        console.log("request made");
        fetch("https://q54hakjlp7.execute-api.us-east-1.amazonaws.com/dev/listAdminRestaurants")
            .then((res) => res.json())
            .then((data) => setRestaurants(data));
    }, []);

    // Filter active restaurants
    const activeRestaurants = restaurants.filter(
        (restaurant: any) => restaurant.restaurant_active
    );

    // Filter restaurants with available tables
    // const showRestaurantsWithAvailableTables = () => {
    //     const filteredRestaurants = restaurants.filter(
    //         (restaurant: any) => restaurant.table_available
    //     );
    //     setAvailableTables(filteredRestaurants);
    // };

    return (
        <div>
            <h1>Consumer Page</h1>
            <button onClick={() => router.push("/")}>Logout</button>
            <h2>Active Restaurants</h2>

            <table border={1}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th> </th>
                        <th>Name</th>
                        <th> </th>
                        <th>Address 1</th>
                        <th> </th>
                        <th>Address 2</th>
                        <th> </th>
                        <th>City</th>
                        <th> </th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    {activeRestaurants.map((restaurant: any) => (
                        <tr key={restaurant.restaurant_id}>
                            <td>{restaurant.restaurant_id}</td>
                            <td> </td>
                            <td>{restaurant.restaurant_name}</td>
                            <td> </td>
                            <td>{restaurant.address1}</td>
                            <td> </td>
                            <td>{restaurant.address2}</td>
                            <td> </td>
                            <td>{restaurant.city}</td>
                            <td> </td>
                            <td>{restaurant.state}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />  <br />
            <h1> </h1>
            <button onClick={() => router.push("makeReservation")}>Make Reservation</button>
            <br />  <br />
            <h1> </h1>
            <button onClick={() => router.push("cancelReservation")}>Cancel Reservation</button>
            <br />  <br />
            <h1> </h1>
            <button onClick={() => router.push("SearchSpecificRestaurant")}>Search Specific Rstaurant</button>
        </div>
    );
};
