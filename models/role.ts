import { Schema, model } from 'mongoose'

const RoleSchema = new Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obigatorio']
    }
})

export default model('Role', RoleSchema);