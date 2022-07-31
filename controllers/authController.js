const User = require("../models/User")
const bcryptjs = require('bcryptjs')
const {validationResult}= require('express-validator')
const nodemailer = require("nodemailer")
require("dotenv").config()
//import nanoid from 'nanoid'

const registerForm =  ((req, res)=>{
    return  res.render('register')
})
const registerUser = async (req, res)=>{
    const errors =validationResult(req)
    if(!errors.isEmpty()){
        req.flash('mensajes', errors.array())
        return res.redirect('/auth/register')
    }
    const {userName,email,password} = req.body
   
    try {
     let usuario = await User.findOne({emai:email})
     if(usuario) throw new Error('ya existe ese usuario en la base de datos')
    usuario= new User({userName:userName, emai:email, password:password,tokenConfirm:Math.random(5)})
    await usuario.save()
    const transport = nodemailer.createTransport({
        host:"smtp.mailtrap.io",
        port: "2525",
        auth:{
            user: process.env.userEmail,
            pass:process.env.passEmail
        }

    })
    await transport.sendMail({
        from:'"Fred Foo " <foo@example.com',
        to: usuario.emai,
        subject: "Verifica tu cuenta de correo",
        html: `<a href="${process.env.PATHHEROKU ||'http://localhost:5000'}/auth/confirmarCuenta/${usuario.tokenConfirm}">Verifica tu cuenta aqui</a>`
    })
    req.flash('mensajes', [{msg: "Revisa tu correo electronico y valida la cuenta"}])
    return res.redirect('/auth/login')
    // enviar correoo al usuario

    } catch (error) {
        req.flash('mensajes', [{msg:error.message}])
        return res.redirect('/auth/register')
    }
}
const confirmarCuenta = async(req, res)=>{
const {token} =req.params
const user = await User.findOne({tokenConfirm:token})
try {
    if(!user) throw new Error('No existe el usuario')
    user.cuentaConfirmada = true
    user.tokenConfirm= null
    await user.save()
    req.flash('mensajes', [{msg: "Cuenta verificada puede iniciar sesion"}]) 
    return res.redirect('/auth/login')
    
} catch (error) {
    req.flash('mensajes', [{msg:error.message}])
    return res.redirect('/auth/login')
}
}

const loginForm =  ((req, res)=>{
   return  res.render('login')
})
const loginUser = async (req, res)=>{
    const errors =validationResult(req)
    if(!errors.isEmpty()){
        req.flash('mensajes', errors.array())
        return res.redirect('/auth/login')
    }
    const {email, password} =req.body
    try {
const user = await User.findOne({emai:email})
if(!user) throw new Error ("No existe este email")
if(!user.cuentaConfirmada) throw new Error ("Falta confirmar la cuenta")
if(!await user.comparePasswords(password)) throw new Error ("Contraseña Incorrecta")
// aqui abajo estoy creando la sesion al usuario a traves de passport
req.login(user,function(err){
    if(err) throw new Error("Error al crear la sesion")
    return res.redirect('/')
})
   
   
} catch (error) {
    req.flash('mensajes', [{msg:error.message}])
        return res.redirect('/auth/login')
}
}
const cerrarSesion = (req,res)=>{
    if(req.isAuthenticated()){
       req.logout(function(err){
        if(err) throw new Error("Error al cerrar la sesion")
    })
    return res.redirect('/auth/login') 
       
    }
    else{
        req.flash('mensajes', [{msg:"No existe ningun usuario autenticado"}])
        return res.redirect('/auth/login')
    }
    
}

module.exports={
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
    cerrarSesion
}