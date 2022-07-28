const formidable = require("formidable")
const path =require('path')
const fs= require('fs')
const Jimp= require('jimp')
const User = require("../models/User")
module.exports.formPerfil = async(req, res)=>{
   try {
      const user = await User.findById(req.user.id)
      return res.render("Perfil", {userName:user.userName, imagen:user.imagen})
   } catch (error) {
      req.flash("mensajes", [{msg:"Error al leer Usuario"}])
      return res.redirect("/perfiles/Perfil")
   }
   return res.render("Perfil")
}

module.exports.editarFotoPerfil = async(req, res)=>{
    const form = new formidable.IncomingForm()
    form.maxFileSixe= 5*1024*1024
    form.parse(req, async(err, fields, files)=>{
      try {
         if(err){
            throw new Error ("fallo la subida de la Imagen")
         }
         
         const file = files.myFile
         if(file.originalFilename===""){
            throw new Error ("Por favor agrega una imagen")
         }
         if(!(file.mimetype==="image/jpeg"||file.mimetype==="image/png")){
            throw new Error ("Por favor agrega una imagen jpg o png")
         }
         if(file.size>5*1024*1024 ){
            throw new Error ("Menos de 5 mb por favor")
         }
         const extension =file.mimetype.split("/")[1]
         const dirfile =path.join(__dirname, `../public/img/Perfiles/${req.user.id}.${extension}`)

         fs.renameSync(file.filepath, dirfile)
         const image= await Jimp.read(dirfile)
         image.resize(200,200).quality(90).writeAsync(dirfile)
         const user = await User.findById(req.user.id)
         user.imagen= `${req.user.id}.${extension}`
         await user.save()
         req.flash("mensajes", [{msg:"ya se subio la imagen"}])
         
         
      } catch (error) {
         req.flash("mensajes", [{msg:error.message}])
         
      }
      finally{
         return res.redirect("/perfiles/Perfil")
      }
    })
}