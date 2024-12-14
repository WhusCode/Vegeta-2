import mysql from 'mysql';

exports.handler = async (event) => {
    const pool = mysql.createPool({
        host: "calculatordb.czo0mym48vbh.us-east-1.rds.amazonaws.com",
        user: "app_password",
        password: "app_password",
        database: "restaurant"
    });

    // Helper to run a query
    const runQuery = (query, params) => {
        return new Promise((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    };

    try {
        // Parse input
        const { 
            restaurantId, 
            restaurantName, 
            address1, 
            address2, 
            city, 
            state, 
            openingHours, 
            closingHours, 
            restaurantActive 
        } = JSON.parse(event.body);

        // Input validation
        if (!restaurantId || !restaurantName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Restaurant ID and Name are required." }),
            };
        }

        // Check if restaurant exists
        const existingRestaurant = await runQuery(
            "SELECT * FROM restaurant WHERE restaurant_id = ?",
            [restaurantId]
        );

        if (existingRestaurant.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Restaurant not found." }),
            };
        }

        // Update restaurant details
        await runQuery(
            `UPDATE restaurant SET 
                restaurant_name = ?, 
                address1 = ?, 
                address2 = ?, 
                city = ?, 
                state = ?, 
                opening_hours = ?, 
                closing_hours = ?, 
                restaurant_active = ? 
             WHERE restaurant_id = ?`,
            [
                restaurantName,
                address1,
                address2,
                city,
                state,
                openingHours,
                closingHours,
                restaurantActive,
                restaurantId,
            ]
        );

        // Success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Restaurant updated successfully." }),
        };
    } catch (error) {
        console.error("Error updating restaurant:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred while updating the restaurant." }),
        };
    } finally {
        pool.end(); // Close the database connection
    }
};
