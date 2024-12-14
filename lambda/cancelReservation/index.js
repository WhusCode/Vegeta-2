import mysql from 'mysql'

export const handler = async (event) => {
  
    // get credentials from the db_access layer (loaded separately via AWS console)
    var db0ps = mysql.createPool({
        host: "calculatordb.czo0mym48vbh.us-east-1.rds.amazonaws.com",
        user: "app_user",
        password: "app_password",
        database: "restaurant"
    })
    let body = JSON.parse(event.body)
    //let body = event.body
    let booking_id = body.booking_id
    console.log(booking_id)
    
    let CancelConstant = (booking_id) => {
        return new Promise((resolve, reject) => {
              console.log(booking_id)
              db0ps.query("DELETE FROM restaurant_reservation WHERE booking_id=?", [booking_id], (error, rows) => {
                  if (error) { return reject(error); }
                  console.log(rows)
                  if ((rows) && (rows.affectedRows == 1)) {
                      return resolve(true);
                  } else {
                      return resolve(false);
                  }
              });
        });
    }

    let response

    try {
      const result = await CancelConstant(booking_id)
      console.log(result)
      if (result) {
        response = { statusCode: 200, 
          body: JSON.stringify({ "success" : true }),
          headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        }
        }
      } else {
        response = { statusCode: 400, 
          body: "No such constant",
          headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        } }
      }
    } catch (err) {
       response = { 
        statusCode: 400, 
        body: err,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      } 
    }
    }
      
    db0ps.end();     // close DB connections
  
    return response;
  }
  
  

  



        