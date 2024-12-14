import { Signer } from "@aws-sdk/rds-signer";
import mysql from "mysql2/promise";

async function dbOps(closing_date,restid) {
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

    const results = await conn.query('DELETE FROM close_dates WHERE closing_date=?;',[closing_date, restid])
    // Close the connection (good practice to close it after the query)
    await conn.end();
    return results.affectedRows
}

export const handler = async (event) => {
    console.log(event.body)


    const body = JSON.parse(event.body)
    //const body = event.body
    if (body.closing_date == ""){
        return {
        "isBase64Encoded": false,
        statusCode: 401,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({ error: "Date not entered"}),
     };
    }

    let numAffectedRows = await dbOps(body.closing_date, body.restaurant_id);

    if (numAffectedRows == 0) {
    return {
        "isBase64Encoded": false,
        statusCode: 401,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({ error: "Date couldn't be closed"}),
     };
    }
    return {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify("worked")
    };
};