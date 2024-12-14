import { Signer } from "@aws-sdk/rds-signer";
import mysql from "mysql2/promise";

export const handler = async (event) => {
    // Define connection configuration using environment variables or hardcoded values
    const connectionConfig = {
        host: "calculatordb.czo0mym48vbh.us-east-1.rds.amazonaws.com",
        user: "app_user",
        password: "app_password",
        database: "restaurant"
    };

    const pool = await mysql.createConnection(connectionConfig);

    // Find the restaurant for the given restaurant_id
    let restaurantLookup = (restaurant) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM restaurant WHERE restaurant_id=?", [restaurant], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                if (rows.length !== 1) {
                    return reject("No such restaurant");
                }
                return resolve(rows[0].restaurant_name);
            });
        });
    };

    // Check that credentials are valid for the given restaurant
    let verifyCredentials = (restaurant, restaurant_id) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM restaurant WHERE restaurantName=? AND credentials=?",
                [restaurant, restaurant_id], (error, rows) => {
                    if (error) {
                        return reject(error);
                    }
                    if (rows.length !== 1) {
                        return resolve(false);
                    }
                    return resolve(true);
                });
        });
    };

    // Set the given show to active
    let activateRestaurant = (restaurant) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE restaurant SET active=1 WHERE restaurant_id=?", [restaurant], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                if (rows.affectedRows != 1) {
                    return reject("No such restaurant");
                }
                return resolve(true);
            });
        });
    };

    const response = {
        statusCode: 200,
    };

    try {
        let restaurant = await restaurantLookup(event.body.restaurant_id);
        let hasToken = await verifyCredentials(restaurant, event.body.restaurant_id);
        if (!hasToken) {
            response.statusCode = 400;
            response.error = "invalid credentials";
            pool.end();
            return response;
        }

        let activate = await activateRestaurant(restaurant.restaurant_id);

    } catch (error) {
        // This final status code 400 is just incase there is a SQL error in any of the earlier functions
        response.statusCode = 400;
        response.error = error;
    }

    pool.end();
    return response;
};
