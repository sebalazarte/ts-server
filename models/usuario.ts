import { Schema, model, Document } from 'mongoose'

interface IUsuario extends Document{
    nombre: string;
    correo: string;
    password: string;
    img: string;
    rol: string;
    estado: boolean;
    google:boolean;
    readonly uid: string;
}

const UsuarioSchema = new Schema<IUsuario>({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

UsuarioSchema.methods.toJSON = function () {
    //saco la version y el password
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('Usuario', UsuarioSchema);
