import { Signer } from "@aws-sdk/rds-signer";
import mysql from "mysql2/promise";

async function dbOps() {
 
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
    const [result] = await conn.execute('SELECT * FROM restaurant');

    // Close the connection (good practice to close it after the query)
    await conn.end();

    return result;
}

export const handler = async (event) => {
    try {
        // Get the data from dbOps function
        const data = await dbOps();

        // Return the results as the Lambda response
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(data),  
        };
    } catch (error) {
        // If there's an error, return it in the response
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
