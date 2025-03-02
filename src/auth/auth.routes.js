import { Router } from 'express'
import { register, login } from './auth.controller.js'

const api = Router()

// Ruta para registrar un nuevo administrador
api.post(
    '/register', 
    register
)

// Ruta para iniciar sesión
api.post(
    '/login', 
    login
)

export default api
