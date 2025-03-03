import Empresa from '../company/company.model.js'
import ExcelJS from 'exceljs'

// Registra una nueva empresa:
export const createCompany = async (req, res) => {
    try {
        const { nombre, nivelImpacto, trayectoria, categoria, descripcion, contacto } = req.body
        const newEmpresa = new Empresa(
            {
                nombre,
                nivelImpacto,
                trayectoria,
                categoria,
                descripcion,
                contacto
            }
        )
        await newEmpresa.save()
        res.status(201).json(
            { 
                success: true, 
                message: 'Empresa creada exitosamente', 
                empresa: newEmpresa 
            }
        )
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: 'Error al crear la empresa', 
                error 
            }
        )
    }
}


// Obtiene todas las empresas con posibilidad de filtrar y ordenar:
/*
    Parámetros opcionales (query):
    - categoria: Filtra por categoría.
    - minTrayectoria y maxTrayectoria: Filtran por rango de años de trayectoria.
    - sort: Define el orden, por ejemplo "nombre_asc" o "nombre_desc".
 */
export const getAllCompanies = async (req, res) => {
    try {
        const { categoria, minTrayectoria, maxTrayectoria, sort } = req.query
        let filter = {}
        if (categoria) {
            filter.categoria = categoria
        }
        if (minTrayectoria || maxTrayectoria) {
            filter.trayectoria = {}
            if (minTrayectoria) filter.trayectoria.$gte = Number(minTrayectoria)
            if (maxTrayectoria) filter.trayectoria.$lte = Number(maxTrayectoria)
        }

        let sortOption = {}
        if (sort) { // Ejemplo: sort = "nombre_asc" o "nombre_desc"
            const [field, order] = sort.split('_')
            sortOption[field] = order === 'asc' ? 1 : -1
        }
        
        const empresas = await Empresa.find(filter).sort(sortOption)
        res.json(
            { 
                success: true, 
                empresas 
            }
        )
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: 'Error al obtener las empresas', 
                error 
            }
        )
    }
}


// Obtiene una empresa por su ID:
export const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params
        const empresa = await Empresa.findById(id)
        if (!empresa) return res.status(404).json(
            { 
                success: false, 
                message: 'Empresa no encontrada' 
            }
        )
        res.json(
            { 
                success: true,
                empresa 
            }
        )
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: 'Error al obtener la empresa', 
                error 
            }
        )
    }
}


// Actualiza la información de una empresa.
export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, nivelImpacto, trayectoria, categoria, descripcion, contacto } = req.body
        const updatedEmpresa = await Empresa.findByIdAndUpdate(
            id,
            { 
                nombre, 
                nivelImpacto, 
                trayectoria, 
                categoria, 
                descripcion, 
                contacto 
            },
            { 
                new: true, 
                runValidators: true 
            }
        )
        if (!updatedEmpresa) return res.status(404).json(
            { 
                success: false, 
                message: 'Empresa no encontrada'
            }
        )
        res.json(
            { 
                success: true, 
                message: 'Empresa actualizada exitosamente', 
                empresa: updatedEmpresa 
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                success: false, 
                message: 'Error al actualizar la empresa', 
                error 
            }
        )
    }
}


// Activa/Desactiva una empresa (Soft delete):
export const toggleCompanyStatus = async (req, res) => {
    try {
        const { id } = req.params
        const empresa = await Empresa.findById(id)
        if (!empresa)
        return res.status(404).json(
            {
                success: false,
                message: 'Empresa no encontrada'
            }
        )
        // Alternar el estado
        empresa.status = !empresa.status
        await empresa.save()
      
        res.json(
            {
                success: true,
                message: `Empresa ${empresa.status ? 'activada' : 'desactivada'}`
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: 'Error actualizando el estado de la empresa',
                error
            }
        )
    }
}


// Genera un reporte en formato Excel con la información de todas las empresas.
export const generateReport = async (req, res) => {
    try {
        const empresas = await Empresa.find()

        // Crear un nuevo libro y una hoja de trabajo con ExcelJS
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Empresas')

        // Definir las columnas del reporte
        worksheet.columns = [
            { 
                header: 'Nombre', 
                key: 'nombre', width: 30 
            },
            { 
                header: 'Nivel de Impacto', 
                key: 'nivelImpacto', width: 20 
            },
            { 
                header: 'Trayectoria (años)', 
                key: 'trayectoria', width: 20 
            },
            { 
                header: 'Categoría', 
                key: 'categoria', width: 20 
            },
            { 
                header: 'Descripción', 
                key: 'descripcion', width: 40 
            },
            { 
                header: 'Email de Contacto', 
                key: 'email', width: 30 
            },
            { 
                header: 'Teléfono de Contacto', 
                key: 'telefono', width: 20 
            },
            { 
                header: 'Fecha de Creación', 
                key: 'createdAt', width: 25 
            }
        ]

        // Agregar una fila por cada empresa
        empresas.forEach(empresa => {
            worksheet.addRow(
                {
                    nombre: empresa.nombre,
                    nivelImpacto: empresa.nivelImpacto,
                    trayectoria: empresa.trayectoria,
                    categoria: empresa.categoria,
                    descripcion: empresa.descripcion,
                    email: empresa.contacto.email,
                    telefono: empresa.contacto.telefono,
                    createdAt: empresa.createdAt ? empresa.createdAt.toLocaleString() : ''
                }
            )
        })

        // Configurar las cabeceras de la respuesta para la descarga del archivo
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'Empresas_Report.xlsx'
        )

        // Escribir el workbook al response y finalizar
        await workbook.xlsx.write(res)
        res.end()
        
    } catch (error) {
        console.error('Error generando el reporte:', error)
        res.status(500).json(
            { 
                success: false, 
                message: 'Error generando el reporte', 
                error 
            }
        )
    }
}
