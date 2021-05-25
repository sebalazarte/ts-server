import { Schema, model, Document } from 'mongoose'

interface IRole extends Document{
    rol: string;
    readonly id: string;
}

const RoleSchema = new Schema<IRole>({
    rol: {
        type: String,
        required: [true, 'El rol es obigatorio']
    }
})


RoleSchema.methods.toJSON = function () {
    //saco la version y el password
    const { __v, _id, ...categoria } = this.toObject();
    categoria.id = _id;
    return categoria;
}


export default model('Role', RoleSchema);