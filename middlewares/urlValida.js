const {URL} =require('url')
const urlValidar =(req, res, next)=>{
    
    try {   
        const {origin} =req.body
        const urlFrontend = new URL(origin)
       // console.log(urlFrontend)
        
        if (urlFrontend.origin !== "null") {
            if(
                urlFrontend.protocol==="http:"||
                urlFrontend.protocol==="https:"
            ){
                return next()
            }
            throw new Error("Tiene que tener https://")
            
        } 
         throw new Error("no válida")
        
        
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}])
        return res.redirect("/")
    }
}
module.exports= urlValidar