import { Schema, model, Document, ObjectId } from 'mongoose'

interface IProducto extends Document {
    nombre: string;
    estado: boolean;
    usuario: ObjectId;
    precio: number;
    categoria: ObjectId;
    descripcion: string;
    disponible: boolean;
    img: string;
    readonly id: string;
}

const ProductoSchema = new Schema<IProducto>({
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
    },
    precio:
    {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
})

ProductoSchema.methods.toJSON = function () {
    //saco la version y el password
    const { __v, estado, _id, ...data } = this.toObject();
    data.id = _id;
    return data;
}

export default model('Producto', ProductoSchema);