const mongoose= require( "mongoose");
const dotenv = require("dotenv");

dotenv.config();

const db_url = process.env.DB_URL;

const connectDB = async () => {

    await mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.log("failed to connect to database" + err.message);
        } else {
            console.log("successfully connected to database");
        }
    });

}

module.exports = connectDB;
