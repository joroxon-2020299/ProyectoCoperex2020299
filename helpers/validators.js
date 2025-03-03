// Validar campos en las rutas
import { body } from "express-validator"
import { validateErrors, validateErrorWithoutImg } from "./validate.error.js"
import { existUsername, ObjectIdValid } from "./db.validators.js"

// Validaciones para el registro de administradores (Auth)
export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail(),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword().withMessage('The password must be strong')
        .isLength({ min: 8 }),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]

// Validaciones para el login de administradores (Auth)
// Se espera recibir en el body: { userLoggin, password }
export const loginValidator = [
    body('userLoggin', 'Username or email cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword().withMessage('The password must be strong')
        .isLength({ min: 8 }),
    validateErrors
]

// Validaciones para guardar (registrar) una nueva empresa (Company)
export const saveCompanyValidator = [
    body('nombre', 'Nombre cannot be empty')
        .notEmpty()
        .trim(),
    body('nivelImpacto', 'Nivel de Impacto cannot be empty and must be one of: Alto, Medio, or Bajo')
        .notEmpty()
        .isIn(['Alto', 'Medio', 'Bajo']),
    body('trayectoria', 'Trayectoria must be a number and cannot be empty')
        .notEmpty()
        .isNumeric().withMessage('Trayectoria must be a numeric value'),
    body('categoria', 'Categoria cannot be empty')
        .notEmpty()
        .trim(),
    // Validación para el subdocumento "contacto"
    body('contacto.email', 'Contacto email is required and must be a valid email')
        .notEmpty()
        .isEmail(),
    body('contacto.telefono', 'Contacto telefono is required and must be a valid phone number')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]
