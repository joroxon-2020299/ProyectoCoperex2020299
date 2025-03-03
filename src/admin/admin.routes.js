import { Router } from 'express'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    updateAdminPassword,
    updateAdminImage,
    toggleAdminStatus
} from '../admin/admin.controller.js'

const api = Router()

api.get(
    '/', 
    [validateJwt], 
    getAllAdmins
)

api.get(
    '/:id', 
    [validateJwt], 
    getAdminById
)

api.put(
    '/:id', 
    [validateJwt], 
    updateAdmin
)

api.put(
    '/password/:id', 
    [validateJwt], 
    updateAdminPassword
)

api.put(
    '/image/:id', 
    [validateJwt], 
    updateAdminImage
)
api.put(
    '/status/:id', 
    [validateJwt], 
    toggleAdminStatus
)

export default api
