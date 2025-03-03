import mongoose from 'mongoose'

const EmpresaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true
        },
        nivelImpacto: {
            type: String,
            required: [true, 'El nivel de impacto es obligatorio'],
            enum: ['Alto', 'Medio', 'Bajo']
        },
        trayectoria: {
            type: Number,
            required: [true, 'La trayectoria (años) es obligatoria'],
            min: [0, 'La trayectoria debe ser un número positivo']
        },
        categoria: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            trim: true
        },
        descripcion: {
            type: String,
            trim: true,
            default: ''
        },
        contacto: {
            email: {
                type: String,
                required: [true, 'El email de contacto es obligatorio'],
                trim: true,
                lowercase: true
            },
            telefono: {
                type: String,
                required: [true, 'El teléfono de contacto es obligatorio'],
                trim: true
            }
        },
        status: {
            type: Boolean,
            default: true
        }
    }, 
    { 
        timestamps: true 
    }
)

export default mongoose.model('Empresa', EmpresaSchema)
