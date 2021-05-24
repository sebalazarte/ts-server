import Usuario from '../models/usuario';

export const existeEmail = async (correo: String) => {
    const existe = await Usuario.findOne({ correo });
    if (existe) {
        throw new Error(`El correo ${correo} ya existe`);
    }
}
