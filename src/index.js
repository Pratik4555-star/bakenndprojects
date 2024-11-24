import dotenv from 'dotenv';
import connectDb from './db/indexdb.js'
dotenv.config({path:'./.env'});
import app from './app.js';


connectDb()
.then(()=> {

    app.on("error",(error)=>{
        console.log(`database or server is on but failed to connected`,error)
        throw error

    })
    app.listen(process.env.PORT|| 8000,()=>{
        console.log("server is running on port",process.env.PORT)
    })
})
.catch((e)=> console.log("Mongodb data connection failed",e.message))















/*
import express from 'express';
const app = express()
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

;(async()=>{
    try{
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      console.log("Connected to the database");
      app.on("error",(error)=>{
        console.log("Error",error)
        throw error
      })

    }catch(error){
        console.log(error.message)
    }
})
    */