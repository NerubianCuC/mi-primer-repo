const express = require("express")
const session = require('express-session')
const flash= require('connect-flash')
const passport = require("passport")
const csrf= require('csurf')
const MongoStorage = require('connect-mongo')
const {create} = require("express-handlebars") 
const User = require("./models/User")
const mongoSanitize = require('express-mongo-sanitize')
const cors =require('cors')
//import {create} from 'express-handlebars'// recibo en una variable las configuraciones de habdlebars
//import dotenv from 'dotenv'
//import db from './database/db'
require('dotenv').config() // lo requiere para conectarse a una base de datos
const clientDB= require("./database/db") // lo requiere para conectarse a una base de datos
const app = express ()
const corsOption ={
    credentials: true,
    origin: process.env.PATHHEROKU||"*",
    methods: ['GET','POST']
}
app.use(cors())
app.use(session({
    secret: process.env.secretsession,
    resave: false,
    saveUninitialized: false,
    name : "secret-name-nerubian",
    store:MongoStorage.create({
        clientPromise: clientDB,
        dbName: process.env.dbName
    }),
    cookie:{secure: process.env.modo=== "production", maxAge:30*24*60*60*1000}
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done)=> done(null, {id:user._id, userName: user.userName}))
passport.deserializeUser(async(user, done)=>{
 const userDB= await User.findById(user.id)
 return done(null,{id:userDB._id, userName: userDB.userName})
})

const hbs= create({    // aqui cambio la extension de handlebars a hbs
    extname: ".hbs",
    partialsDir: ["views/components"],
})
app.engine(".hbs", hbs.engine) // aqui le estamos diciendo que hbs va a ser el motor de plantilla
app.set("view engine", ".hbs") // aqui le decimos que la extension va a ser hbs
app.set("views", "./views")// y que las plantillas van a estar dentro de la carpeta views
app.use(express.static(__dirname + "/public")) // para conectar con el frontend
app.use(express.urlencoded({extended: true})) // para ver lo que trae el metodo post
app.use(csrf())
app.use(mongoSanitize());
app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken()
    res.locals.mensajes = req.flash("mensajes")
    next()
})
app.use("/", require("./routes/home")) // para llamar a los archivos que estan en la carpeta routes
app.use("/auth", require("./routes/auth"))
app.use("/Usuarios", require("./routes/Usuarios"))
app.use("/perfiles", require("./routes/perfiles"))
const PORT= process.env.PORT|| 5000
app.listen(PORT, ()=> console.log("Servidor Andando" + " " +PORT))