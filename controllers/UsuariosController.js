const Url = require("../models/Url")
const User = require("../models/User")
const mostrarUsuarios = async(req, res)=>{
  
  
    try {
        const usuarios = await User.find().lean()
        return  res.render('Usuarios', {usuarios})
    } catch (error) {
        return res.send(error)
    }
}
const eliminarUser = async(req, res)=>{
    const {id}= req.params
    const UrlExistente = await Url.findOne({user:id})
    
    
    try {
        
        if(!(UrlExistente===null)){
      throw new Error ("Este usuario no se puede eliminar, tiene URLS asociadas")
    }
        
        if((req.user.id).toString()===id){
        req.logout(function(err){
        if(err) throw new Error("Error al cerrar la sesion")
        })
        }
        await User.findByIdAndDelete(id)
        
    } catch (error) {
        req.flash('mensajes', [{msg:error.message}])
        }
    finally{
        return res.redirect('/Usuarios/Usuarios')
    }

}

module.exports={
    mostrarUsuarios,
    eliminarUser
}