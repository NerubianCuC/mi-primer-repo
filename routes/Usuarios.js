const express= require("express")
const { mostrarUsuarios, eliminarUser } = require("../controllers/UsuariosController")
const verificarUser = require("../middlewares/verificarUser")
const router = express.Router()
router.get('/Usuarios',mostrarUsuarios)
router.get('/eliminar/:id',verificarUser, eliminarUser)


module.exports= router