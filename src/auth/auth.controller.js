import Admin from '../admin/admin.model.js'
import { encrypt, checkPassword } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

/*
 * Función para crear un administrador predeterminado al iniciar la aplicación:
- Se utiliza en el arranque del servidor para garantizar que exista al menos un administrador.
 */
export const createDefaultAdmin = async () => {
    try {
        // Verificar si ya existe algún administrador
        const existingAdmin = await Admin.findOne()
        if (existingAdmin) return // Si existe, no se hace nada

        // Valores predeterminados configurables mediante variables de entorno
        const name = process.env.DEFAULT_ADMIN_NAME || 'Default'
        const surname = process.env.DEFAULT_ADMIN_SURNAME || 'Admin'
        const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin'
        const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com'
        const phone = process.env.DEFAULT_ADMIN_PHONE || '0000000000'
        const password = process.env.DEFAULT_ADMIN_PASSWORD || 'password123'

        // Encriptar la contraseña predeterminada
        const hashedPassword = await encrypt(password)

        const newAdmin = new Admin(
            {
                name,
                surname,
                username,
                email,
                password: hashedPassword,
                phone,
                status: true
            }
        )

        await newAdmin.save()
        console.log('Default admin created successfully')
    } catch (error) {
        console.error('Error creating default admin:', error)
    }
}


/*
 * Registro de administrador:
 - Se recibe la información en el body y se crea un nuevo administrador.
 - Se encripta la contraseña y se asigna por defecto el rol "ADMIN".
 */
export const register = async (req, res) => {
    try {
        // Capturar los datos del body
        let data = req.body
        // Crear instancia del administrador
        let admin = new Admin(data)
        // Encriptar la contraseña
        admin.password = await encrypt(admin.password)
        // Asegurar el rol de administrador
        admin.role = 'ADMIN'
        // Guardar en la BD
        await admin.save()
        // Responder al usuario
        return res.send(
            {
                message: `Registered successfully, can log in with username: ${admin.username}`
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                message: 'General error with registering admin',
                err
            }
        )
    }
}

/*
 * Login de administrador:
 - Se valida que exista un administrador con el email o username ingresado y que la contraseña coincida.
 - Si es correcto, se genera un token JWT.
 */
export const login = async (req, res) => {
    try {
        // Capturar datos del body: userLoggin (puede ser email o username) y password
        let { userLoggin, password } = req.body
        // Buscar administrador que cumpla con la condición
        let admin = await Admin.findOne(
            {
                $or: [
                    { email: userLoggin },
                    { username: userLoggin }
                ]
            }
        )
        // Verificar que el admin exista y que la contraseña coincida
        if (admin && await checkPassword(admin.password, password)) {
            let loggedAdmin = {
                uid: admin._id,
                name: admin.name,
                username: admin.username,
                role: 'ADMIN'
            }
            // Generar token JWT
            let token = await generateJwt(loggedAdmin)
            return res.send(
                {
                    message: `Welcome ${admin.name}`,
                    loggedAdmin,
                    token
                }
            )
        }
        return res.status(400).send({ message: 'Wrong email or password' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error with login function'})
    }
}