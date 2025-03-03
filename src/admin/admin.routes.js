import { Router } from 'express'
import { 
  getAllAdmins, 
  getAdminById, 
  updateAdmin, 
  updateAdminPassword, 
  updateAdminImage, 
  toggleAdminStatus 
} from './admin.controller.js'
import multerUploads from '../../middlewares/multer.uploads.js' // Asegúrate de que la ruta sea la correcta

const api = Router()

// Ruta para obtener todos los administradores
api.get(
    '/', 
    getAllAdmins
)

// Ruta para obtener un administrador por ID
api.get(
    '/:id', 
    getAdminById
)

// Ruta para actualizar datos del administrador (excepto contraseña e imagen)
api.put(
    '/:id', 
    updateAdmin
)

// Ruta para actualizar la contraseña del administrador
api.put(
    '/:id/password', 
    updateAdminPassword
)

// Ruta para actualizar la imagen de perfil del administrador
api.put(
    '/:id/image', 
    multerUploads, 
    updateAdminImage
)

// Ruta para activar/desactivar un administrador
api.put(
    '/:id/status', 
    toggleAdminStatus
)

export default api
