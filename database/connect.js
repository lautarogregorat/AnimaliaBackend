const {createPool} = require('mysql2/promise');

async function connectDB () {
        const pool = await createPool({
        database: "animalia",
        user: "8vddmvcl7mfgehm1hr90",
        host: "aws.connect.psdb.cloud",
        password: "pscale_pw_TJW3lq8HYigMSMbRBJkHeiJH6fFNnUCI3RwIeigSt2J",
        ssl: {
            rejectUnauthorized: false
        }
    })
    
    console.log("Coneccion a base de datos lista")

}

module.exports = connectDB
