import mysql from 'mysql';

export const handler = async (event) => {
    const db0ps = mysql.createPool({
        host: "calculatordb.czo0mym48vbh.us-east-1.rds.amazonaws.com",
        user: "app_user",
        password: "app_password",
        database: "restaurant"
    });

    let body;
    try {
        body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch (err) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid JSON input" }),
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            }
        };
    }

    const { booking_date, booking_time, restaurant_id, table_number, number_of_seats, email_id, confirmation_code } = body;

    if (!booking_date || !booking_time || !restaurant_id || !table_number || !number_of_seats || !email_id || confirmation_code === undefined) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing required fields" }),
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            }
        };
    }

    const makeReservation = (
        booking_date,
        booking_time,
        restaurant_id,
        table_number,
        number_of_seats,
        email_id,
        confirmation_code
    ) => {
        return new Promise((resolve, reject) => {
            db0ps.query(
                `INSERT INTO restaurant_reservation (booking_date, booking_time, restaurant_id, table_number, number_of_seats, email_id, confirmation_code)
                 VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [booking_date, booking_time, restaurant_id, table_number, number_of_seats, email_id, confirmation_code],
                (error, rows) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(rows.insertId); // Return the generated booking_id
                }
            );
        });
    };

    let response;

    try {
        const bookingId = await makeReservation(
            booking_date,
            booking_time,
            restaurant_id,
            table_number,
            number_of_seats,
            email_id,
            confirmation_code
        );

        response = {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Reservation successfully created",
                booking_id: bookingId
            }),
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            }
        };
    } catch (err) {
        response = {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            }
        };
    }

    db0ps.end();

    return response;
};
