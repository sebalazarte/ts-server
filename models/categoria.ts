import { Schema, model, Document, ObjectId } from 'mongoose'

interface ICategoria extends Document {
    nombre: string;
    estado: boolean;
    usuario: ObjectId;
    readonly id: string;
}

const CateroriaSchema = new Schema<ICategoria>({
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

CateroriaSchema.methods.toJSON = function () {
    //saco la version y el password
    const { __v, estado, _id, ...categoria } = this.toObject();
    categoria.id = _id;
    return categoria;
}

export default model('Categoria', CateroriaSchema);