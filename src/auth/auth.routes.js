import { Router } from 'express'
import { register, login } from '../auth/auth.controller.js'
import { registerValidator, loginValidator } from '../../helpers/validators.js'
import { uploadProfilePicture } from '../../middlewares/multer.uploads.js'
import { deleteFileOnError } from '../../middlewares/delete.file.on.error.js'

const api = Router()

api.post(
    '/register',
    [
        uploadProfilePicture.single('profilePicture'), 
        registerValidator, 
        deleteFileOnError
    ],
    register
)

api.post(
    '/login', 
    [loginValidator], 
    login
)

export default api
