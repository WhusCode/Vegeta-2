import { Signer } from "@aws-sdk/rds-signer";
import mysql from "mysql2/promise";

async function dbOps(restaurantName) {
    const connectionConfig = {
        host: "calculatordb.czo0mym48vbh.us-east-1.rds.amazonaws.com",
        user: "app_user",
        password: "app_password",
        database: "restaurant"
    };

    const conn = await mysql.createConnection(connectionConfig);

    try {
        // Trim and lowercase the input for case-insensitive matching
        const trimmedName = restaurantName.trim();
        console.log("Searching for restaurant:", trimmedName);

        const [result] = await conn.query(
            `SELECT *
             FROM restaurant 
             WHERE LOWER(restaurant_name) LIKE LOWER(?);`,
            [`%${trimmedName}%`]
        );

        console.log("Query Result:", result);

        return result;
    } catch (error) {
        console.error("Database query error:", error.message);
        throw error;
    } finally {
        await conn.end();
    }
}

export const handler = async (event) => {
    let body;
    try {
        body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch (parseError) {
        console.error("Error parsing input body:", parseError.message);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid JSON input" }),
        };
    }

    if (!body.restaurant_name) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing restaurant name" }),
        };
    }

    try {
        const restaurants = await dbOps(body.restaurant_name);

        if (restaurants.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Restaurant not found" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(restaurants),
        };
    } catch (error) {
        console.error("Unhandled error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
