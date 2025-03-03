//Middleware de validación de tokens
'use strict'

import jwt from 'jsonwebtoken'
import { findUser } from '../helpers/db.validators.js'

// Middleware para validar que el token sea válido y no haya expirado
export const validateJwt = async (req, res, next) => {
    try {
        const secretKey = process.env.SECRET_KEY
        const { authorization } = req.headers
        
        if (!authorization) {
            return res.status(401).send({ message: 'Unauthorized: No token provided' })
        }
        
        // Desencriptar el token
        const user = jwt.verify(authorization, secretKey)
        
        // Verificar que el usuario aún exista en la BD
        const validateUser = await findUser(user.uid)
        if (!validateUser) {
            return res.status(404).send({
                success: false,
                message: 'User not found - Unauthorized'
            })
        }
        
        // Inyectar la información del usuario en la solicitud
        req.user = user
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send({ message: 'Invalid token or expired' })
    }
}

// Middleware para validar que el usuario tenga el rol de ADMIN
export const isAdmin = async (req, res, next) => {
    try {
        const { user } = req
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).send({
                success: false,
                message: `You don't have access | username ${user && user.username ? user.username : ''}`
            })
        }
        next()
    } catch (err) {
        console.error(err)
        return res.status(403).send({
            success: false,
            message: 'Unauthorized role'
        })
    }
}
