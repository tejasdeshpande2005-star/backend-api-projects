const { Pool } = require("pg");
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

const connectDB = async ()=>{
    try{
        const client = await pool.connect();
        console.log("POSTGRE SQL CONNECTED");
        client.release();
    }catch(error){
        console.log("POSTGRE SQL NOT CONNECTED");
        console.error(error.message);
    }
};

module.exports = {
    pool,
    connectDB
};