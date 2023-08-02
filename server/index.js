import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import connectDB from "./database/connection.js";

dotenv.config();
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json())

app.get("/", async (req, res) => {
    try {
        res.send("Hi from server")
    } catch (err) {
        console.log(err);
    }
})





// connecting to database 
connectDB().then(() => {
    // Starting the server
    app.listen(process.env.PORT, () => {
        console.log('server started at ', process.env.PORT)
    })
}).catch((error) => {
    console.log("Failed to start server", error);
})