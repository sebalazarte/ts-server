import { Schema, model } from 'mongoose'

const CateroriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obigatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

// CateroriaSchema.methods.toJSON = function () {
//     //saco la version y el password
//     const { __v, estado, _id, ...categoria } = this.toObject();
//     categoria.id = _id;
//     return categoria;
// }

export default model('Categoria', CateroriaSchema);