import mongoose, {Schema} from "mongoose";

const subsciptionSchema = new Schema({
    subsciber:{
             type: Schema.Types.Objectid,
            ref: User
        },
    channel:{
            type: Schema.Types.Objectid,
            ref: User
        },

},{timestamps:true})

export const Subsciption = mongoose.model("Subscription", subsciptionSchema)
