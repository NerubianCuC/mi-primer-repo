const mongoose = require("mongoose")

const {Schema} = mongoose // el equema define como va a ser la estructura del documento en la base de datos
const urlSchema =new Schema({
    origin: {
        type: String,
        unique: false,
        required: true,
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true,
        default:"fdfdf"
    },
    user:{
        type : Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Url =mongoose.model("Url", urlSchema)
module.exports= Url