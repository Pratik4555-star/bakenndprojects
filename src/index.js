import dotenv from 'dotenv';
import connectDb from './db/indexdb.js'
dotenv.config({path:'./.env'});


connectDb()















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