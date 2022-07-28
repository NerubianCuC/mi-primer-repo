const express= require("express")
const verificarUser = require("../middlewares/verificarUser")
const router = express.Router()
const { formPerfil,editarFotoPerfil } = require("../controllers/perfilController")
router.get("/Perfil",verificarUser, formPerfil)
router.post("/Perfil",verificarUser, editarFotoPerfil)
module.exports= router