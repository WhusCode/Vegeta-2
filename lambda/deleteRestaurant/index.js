import mysql from 'mysql';

export const handler = async (event) => {
    // get credentials from the db_access layer (loaded separately via AWS console)
    var db0ps = mysql.createPool({
        host: "calculatordb.czo0mym48vbh.us-east-1.rds.amazonaws.com",
        user: "app_user",
        password: "app_password",
        database: "restaurant"
    });

    let body = JSON.parse(event.body);
    let restaurant_id = body.restaurant_id;
    console.log(restaurant_id);

    let deleteRestaurant = (restaurant_id) => {
        return new Promise((resolve, reject) => {
            console.log(restaurant_id);
            db0ps.query("DELETE FROM restaurant WHERE restaurant_id=?", [restaurant_id], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                console.log(rows);
                if (rows && rows.affectedRows === 1) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    };

    let deleteManager = (restaurant_id) => {
        return new Promise((resolve, reject) => {
            db0ps.query("DELETE FROM user_info WHERE restaurant_id=?", [restaurant_id], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                console.log(rows);
                if (rows && rows.affectedRows === 1) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    };

    let response;

    try {
        const resultRestaurant = await deleteRestaurant(restaurant_id);
        const resultManager = await deleteManager(restaurant_id);

        if (resultRestaurant && resultManager) {
            response = {
                statusCode: 200,
                body: JSON.stringify({ success: true }),
                headers: {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                }
            };
        } else {
            response = {
                statusCode: 400,
                body: "Failed to delete restaurant or manager",
                headers: {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                }
            };
        }
    } catch (err) {
        response = {
            statusCode: 400,
            body: JSON.stringify({ error: err.message }),
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            }
        };
    }

    db0ps.end(); // close DB connections

    return response;
};
