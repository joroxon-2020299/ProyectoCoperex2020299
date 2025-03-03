import Admin from '../admin/admin.model.js'
import { encrypt, checkPassword } from '../../utils/encrypt.js'
import fs from 'fs'

// Obtener todos los administradores
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find()
        res.json({ success: true, admins })
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: 'Error fetching admins', 
                error 
            }
        )
    }
}

// Obtener un administrador por ID
export const getAdminById = async (req, res) => {
    try {
        const { id } = req.params
        const admin = await Admin.findById(id)
        if (!admin) return res.status(404).json(
            { 
                success: false, 
                message: 'Admin not found' 
            }
        )
        res.json({ success: true, admin })
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: 'Error fetching admin', 
                error 
            }
        )
    }
}

// Actualizar datos del administrador (excepto contraseña e imagen)
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const { name, surname, username, email, phone } = req.body
        const updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            { 
                name, 
                surname, 
                username, 
                email, 
                phone 
            },
            { 
                new: true, 
                runValidators: true 
            }
        )
        if (!updatedAdmin)
            return res.status(404).json(
            { 
                success: false, 
                message: 'Admin not found' 
            }
        )
        res.json(
            { 
                success: true, 
                message: 'Admin updated successfully', 
                updatedAdmin 
            }
        )
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: 'Error updating admin', 
                error 
            }
        )
    }
}

// Actualizar la contraseña del administrador
export const updateAdminPassword = async (req, res) => {
    try {
        const { id } = req.params
        const { oldPassword, newPassword } = req.body
        const admin = await Admin.findById(id)
        if (!admin)
            return res.status(404).json(
            { 
                success: false, 
                message: 'Admin not found' 
            }
        )
        
        // Verificar la contraseña actual
        const isMatch = await checkPassword(oldPassword, admin.password)
        if (!isMatch)
            return res.status(400).json(
            { 
                success: false, 
                message: 'Incorrect old password' 
            }
        )

        // Encriptar y actualizar la nueva contraseña
        admin.password = await encrypt(newPassword)
        await admin.save()

        res.json(
            { 
                success: true, 
                message: 'Password updated successfully' 
            }
        )
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: 'Error updating password', 
                error 
            }
        )
    }
}

// Actualizar la imagen de perfil del administrador
export const updateAdminImage = async (req, res) => {
    try {
        const { id } = req.params
        const admin = await Admin.findById(id)
        if (!admin)
            return res.status(404).json(
            { 
                success: false, 
                message: 'Admin not found' 
            }
        )
        
        // Eliminar imagen previa si existe
        if (admin.profilePicture) {
            fs.unlinkSync(admin.profilePicture)
        }
        
        // Asignar la nueva imagen
        admin.profilePicture = req.file.path
        await admin.save()

        res.json(
            { 
                success: true, 
                message: 'Profile picture updated', 
                profilePicture: admin.profilePicture 
            }
        )
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: 'Error updating profile picture', 
                error 
            }
        )
    }
}

// Activar/Desactivar un administrador (Soft delete)
export const toggleAdminStatus = async (req, res) => {
    try {
        const { id } = req.params
        const admin = await Admin.findById(id)
        if (!admin)
            return res.status(404).json(
            { 
                success: false, 
                message: 'Admin not found' 
            }
        )
        
        // Alternar estado
        admin.status = !admin.status
        await admin.save()

        res.json(
            { 
                success: true, 
                message: `Admin ${admin.status ? 'activated' : 'deactivated'}` 
            }
        )
    } catch (error) {
        res.status(500).json(
            { 
                success: false, 
                message: 'Error updating admin status', 
                error 
            }
        )
    }
}