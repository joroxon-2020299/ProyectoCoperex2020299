import { Schema, model } from 'mongoose';

const adminSchema = new Schema(
    {  
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't overcome 25 characters`],
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, `Can't overcome 25 characters`],
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true, 
            maxLength: [15, `Can't overcome 15 characters`],
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be at least 8 characters'],
            maxLength: [100, `Can't overcome 100 characters`],
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            maxLength: [13, `Can't overcome 13 numbers`],
            minLength: [8, 'Phone must be at least 8 numbers']
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)

// Excluir `password` y `__v` al devolver la respuesta JSON
adminSchema.methods.toJSON = function() {
    const { __v, password, ...admin } = this.toObject()
    return admin
}

// Exportar modelo
export default model('Admin', adminSchema)