import { Signer } from "@aws-sdk/rds-signer";
import mysql from "mysql2/promise";

async function dbOps(reservationId) {
    const connectionConfig = {
        host: "calculatordb.czo0mym48vbh.us-east-1.rds.amazonaws.com",
        user: "app_user",
        password: "app_password",
        database: "restaurant"
    };

    const conn = await mysql.createConnection(connectionConfig);

    try {
        const [reservation] = await conn.query(
            `SELECT * FROM restaurant_reservation WHERE booking_id = ?;`,
            [reservationId]
        );

        await conn.end();
        return reservation;
    } catch (error) {
        await conn.end();
        throw error;
    }
}

export const handler = async (event) => {
    const body = JSON.parse(event.body);

    if (!body.booking_id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing booking ID" }),
        };
    }

    try {
        const reservation = await dbOps(body.booking_id);

        if (reservation.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Reservation not found" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(reservation),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

