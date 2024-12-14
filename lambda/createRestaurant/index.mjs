import { Signer } from "@aws-sdk/rds-signer";
import mysql from "mysql2/promise";

async function dbOps(body) {
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

      function generateRandomPassword(length = 12) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-="';
        let password = '';
        for (let i = 0; i < length; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
      }
      
      function generateRandomUsername(length = 8) {
        const chars = '0123456789';
        let username = '';
        for (let i = 0; i < length; i++) {
          username += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return username;
      }

      function generateRandomRestaurantId(length = 4) {
        const chars = '0123456789';
        let username = '';
        for (let i = 0; i < length; i++) {
          username += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return username;
      }
      
      const password = generateRandomPassword();
      const username = generateRandomUsername();
      const restaurantId = generateRandomRestaurantId()
      
      console.log('Password:', password);
      console.log('Username:', username);

    const resultuser = await conn.query('insert into user_info values(?,?,?,?,?,?);',[restaurantId,2,restaurantId,password,username,''])
    const result = await conn.query('insert into restaurant values(?,?,?,?,?,?,?,?,?,?,?);', 
    [restaurantId,body.restaurant_name,body.address1,body.address2,body.city,body.state,body.zipcode,body.opening_hours,body.closing_hours,0,restaurantId])
    console.log (result)
    const user = await conn.query('select * from user_info where user_name = ?;',[username])
    // Close the connection (good practice to close it after the query)
    await conn.end();
    return user[0]
}

export const handler = async (event) => {
    let body = event.body
    body = JSON.parse(event.body)
    
    if (body.restaurant_name == "" || body.address1== "" ||body.city == "" ||body.zipcode == "" ||body.state == "" ){
        return {
        "isBase64Encoded": false,
        statusCode: 401,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({ error: "Empty restaurant failed"}),
     };
    }
    let [result] = await dbOps(body);

    if (result.affectedRows == 0) {
    return {
        "isBase64Encoded": false,
        statusCode: 401,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({ error: "Create restaurant failed"}),
     };
    }
    return {
        "isBase64Encoded": false,
        "statusCode": 200,
        "body": JSON.stringify(result) ,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    };
};