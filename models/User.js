const bcryptjs = require('bcryptjs')
const mongoose = require("mongoose")

const {Schema} = mongoose
const userSchema =new Schema({
    userName: {
        type: String,
        lowercase:true,
        required: true,
    },
    emai: {
        type: String,
        lowercase:true,
        required: true,
        unique: true,
        index: {unique:true}
    },
    password :{
        type: String,
         required: true,
    },
    tokenConfirm:{
        type:String,
        default:null,
    },
    cuentaConfirmada:{
        type:Boolean,
        default: false
    },
    imagen :{
        type: String,
        default: null
    }

})

userSchema.pre('save', async function(next){
    const user =this
    if(!user.isModified('password')) return next ()
    try {
        const salt= await bcryptjs.genSalt(10)
        const hash= await bcryptjs.hash(user.password, salt)
         user.password= hash
         next()
        
    } catch (error) {
        console.log(error)
        throw new Error ("Error al codificar la contraseña")
        
    }
})
userSchema.methods.comparePasswords = async function(candidatePass){
    return await bcryptjs.compare(candidatePass, this.password)
}

const User =mongoose.model("User", userSchema)
module.exports= User
/*module.exports = mongoose.model('User', userSchema)*/