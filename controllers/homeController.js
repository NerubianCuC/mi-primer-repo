const Url = require('../models/Url')
const {validationResult}= require('express-validator')

let i= (Math.random(5))
const leerUrls = async(req, res)=>{// este metodo es para leer todas las filas de la base de datos
    
  try {
    const urls = await Url.find({user:req.user.id}).lean()  // este metodo es para leer datos de una base de datos
    
    return res.render('home',{urls:urls})

    } catch (error) {
        req.flash('mensajes', [{msg:error.message}])
        return res.redirect('/')
    }
    
}
const agregarUrl = async(req, res) =>{  // este metodo es para agregar datos a una base de datos
    const errors =validationResult(req)
     if(!errors.isEmpty()){
        req.flash('mensajes', errors.array())
        return res.redirect('/')
    }    
    const {origin} = req.body
    
    
    
    
    try {
            const url = new Url({origin: origin, shortUrl:i, user:req.user.id})
                        
             if(!(await Url.findOne({origin:origin})===null)){
                 throw new Error ("Ya esta Url Existe")
               // const userUrl =await Url.findOne({origin:origin})
              // console.log(userUrl.user.toString())
               // console.log(url.user.toString())
               /* if(userUrl.user.toString()===url.user.toString()){
                    console.log("Entre aqui")
                   
                }*/
            }  

            await url.save()
            i++
            req.flash('mensajes', [{msg:"Url Agregada"}])
          return  res.redirect('/')
        } catch (error) {
            
        req.flash('mensajes', [{msg:error.message}])
        return res.redirect('/')
            
        }
}
const eliminarUrl = async(req, res)=>{//para buscar por el id del model y eliminarlo
    const {id}= req.params
    
    try {
     const url=await Url.findById(id)
     if(!url.user.equals(req.user.id)){
        throw new Error("No es tu Url")
     }
        await url.remove()
        req.flash('mensajes', [{msg:"Url Eliminada Satisfactoriamente"}])
        return res.redirect('/')
    } catch (error) {
        req.flash('mensajes', [{msg:error.message}])
        return res.redirect('/')
    }
}
const editarURLForm = async(req, res) =>{
    const {id}= req.params
    try {
        const url =await Url.findById(id).lean()
        if(!url.user.equals(req.user.id)){
            throw new Error("No es tu Url")
        }
      return  res.render('home',{url})
        
    } catch (error) {
        req.flash('mensajes', [{msg:error.message}])
        return res.redirect('/')
    }
}

const editarURL = async(req, res)=>{
    const {id}= req.params
    const {origin}= req.body
    try {
        const url=await Url.findById(id)
     if(!url.user.equals(req.user.id)){
        throw new Error("No es tu Url")
     }
        await url.updateOne({origin})
        req.flash('mensajes', [{msg:"Url Editada Satisfactoriamente"}])
        res.redirect('/')
        
        
    } catch (error) {
        req.flash('mensajes', [{msg:error.message}])
        return res.redirect('/')
    }
}
const redireccionamiento =async(req, res)=>{

    const {shortUrl}= req.params
   
   
     try {
        const urlDB = await Url.findOne({shortUrl:shortUrl})
       return res.redirect(urlDB.origin)
        
    } catch (error) {
       req.flash('mensajes', [{msg:"No existe esta url configurada"}])
        return res.redirect('/auth/login')
    } 
}


module.exports={

    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarURLForm,
    editarURL,
    redireccionamiento    
}