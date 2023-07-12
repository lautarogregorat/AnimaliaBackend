const {createPool} = require('mysql2/promise');

async function connectDB () {
        const pool = await createPool({
        database: "animalia",
        user: "dw9ekho67powef39vf3x",
        host: "aws.connect.psdb.cloud",
        password: "pscale_pw_WosZ9TGzsJZRcuxLNBd4kHKffVf3tjjVWEVbeFEjBgK",
        ssl: {
            rejectUnauthorized: false
        }
    })
    
    console.log("Coneccion a base de datos lista")

}

module.exports = connectDB
