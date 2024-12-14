import { Signer } from "@aws-sdk/rds-signer";
import mysql from "mysql2/promise";

async function dbOps(username) {
    // Define connection configuration using environment variables or hardcoded values
    const connectionConfig = {
        host: "calculatordb.czo0mym48vbh.us-east-1.rds.amazonaws.com",
        user: "app_user",
        password: "app_password",
        database: "restaurant"
    };

    // Create the connection to the DB
    const conn = await mysql.createConnection(connectionConfig);
    // Execute the query
    const [rows] = await conn.execute('SELECT user_password FROM restaurant.user_info where role_id=1 and user_name=?',[username]);
    // Close the connection (good practice to close it after the query)
    await conn.end();
    // Return the rows (ideally we return the first row, since there should only be one matching username)
    return rows; // Return the first user found (or undefined if no match)
}

export const handler = async (event) => {
    let body = JSON.parse(event.body);
    console.log(typeof body);
    let username = body.username;
    let password = JSON.stringify(body.password);


    if (!username || !password) {
        return {
            "isBase64Encoded": false,
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ error: "password and username not provided" }),
        };
    }

    // Query the DB for user credentials
    const db_password = await dbOps(username);
    console.log(JSON.stringify(db_password[0].user_password),password);

    // Check if user exists and if passwords match
    if (password === JSON.stringify(db_password[0].user_password)) {
        return {
            "isBase64Encoded": false,
            "statusCode": 200,
            "body": JSON.stringify({ message: "Login successful!" }),
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
        };
    }

    // If no match, return Unauthorized
    return {
        "isBase64Encoded": false,
        statusCode: 401,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({ error: "Password and username not matched"}),
    };

};
