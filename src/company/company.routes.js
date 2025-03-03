import { Router } from 'express'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { saveCompanyValidator } from '../../helpers/validators.js'
import {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    toggleCompanyStatus,
    generateReport
} from '../company/company.controller.js'

const api = Router()

api.post('/', 
    [validateJwt], 
    saveCompanyValidator, 
    createCompany
)

api.get(
    '/', 
    [validateJwt], 
    getAllCompanies
)

api.get(
    '/:id', 
    [validateJwt], 
    getCompanyById
)

api.put(
    '/:id', 
    [validateJwt], 
    updateCompany
)

api.put(
    '/status/:id', 
    [validateJwt], 
    toggleCompanyStatus
)

api.get(
    '/report', 
    [validateJwt], 
    generateReport
)

export default api
