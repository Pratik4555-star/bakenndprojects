import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDb = async ()=>{
    try{
        const Connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // console.log(Connection)
        console.log(`Mongodb Conneted !! Db host:${Connection.connection.host}`)

    }catch(error){
        console.log("mongodb error",error);
        process.exit(1)
    }
}

export default connectDb