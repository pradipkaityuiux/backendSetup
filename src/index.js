import dotenv from "dotenv"
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config(
    {path: "./.env"}
)
connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log("Error: ", error);
        throw error
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongodb Connection Failed", err);
})








/*
import express from "express"
const app = express();
(async function connectDB(){
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)  // MONGODB_URI is in .env file to get the MongoDB URL
        app.on("error", (error)=>{
            console.log("Error: ", error);
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log("App is listening at: ",process.env.PORT);
        })
    }catch(error){
        console.log(error)
    }
})()
*/