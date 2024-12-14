import { Signer } from "@aws-sdk/rds-signer";
import mysql from "mysql2/promise";

async function dbOps(restaurantId, date) {
    // Define connection configuration
    const connectionConfig = {
        host: "calculatordb.czo0mym48vbh.us-east-1.rds.amazonaws.com",
        user: "app_user",
        password: "app_password",
        database: "restaurant"
    };

    // Create the connection to the DB
    const conn = await mysql.createConnection(connectionConfig);

    try {
        // Check if the restaurant is closed on the given date
        const [closedDate] = await conn.query(
            `SELECT * FROM close_dates WHERE restaurant_id = ? AND closing_date = ?;`,
            [restaurantId, date]
        );

        if (closedDate.length > 0) {
            return { error: "The restaurant is closed on this date" };
        }

        // Fetch all tables for the restaurant
        const [tables] = await conn.query(
            `SELECT restaurant_id, table_number, number_of_seats 
             FROM restaurant_table 
             WHERE restaurant_id = ?;`,
            [restaurantId]
        );

        return tables;
    } catch (error) {
        console.error("Database query error:", error.message);
        throw error;
    } finally {
        // Close the connection
        await conn.end();
    }
}

export const handler = async (event) => {
    console.log(event.body);

    // Parse the input body
    const body = event.body;

    if (!body.restaurant_id || !body.date) {
        return {
            isBase64Encoded: false,
            statusCode: 401,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ error: "Missing restaurant ID or date" }),
        };
    }

    try {
        const availability = await dbOps(body.restaurant_id, body.date);

        if (availability.error) {
            return {
                isBase64Encoded: false,
                statusCode: 401,
                headers: {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                body: JSON.stringify({ error: availability.error }),
            };
        }

        return {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(availability),
        };
    } catch (error) {
        console.error("Unhandled error:", error.message);
        return {
            isBase64Encoded: false,
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
