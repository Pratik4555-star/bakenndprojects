import mongoose,{ Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const videoSchema = new Schema({

    videofile:{
        type:String,
        required: true
    },
    thumbnail:{
        type:String,
        required: true
    },
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    time:{
        type: Number,
        required: true
    },
    viwes:{
        type: Number,
        default: 0
    },
    isPublished:{
        type: Boolean,
        default:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},{timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",videoSchema)