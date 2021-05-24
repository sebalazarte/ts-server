import Usuario from '../models/usuario';
import Role from '../models/role';
import Categoria from '../models/categoria';
import Producto from '../models/producto';


export const esRolValido = async (rol: string) => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
}

export const existeEmail = async (correo: string) => {
    const existe = await Usuario.findOne({ correo });
    if (existe) {
        throw new Error(`El correo ${correo} ya existe`);
    }
}

export const existeUsuarioPorId = async (id: any) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

export const existeCategoriaPorId = async (id: any) => {
    const existe = await Categoria.findById(id);
    if (!existe) {
        throw new Error(`El id ${id} no existe`);
    }
}

export const existeProductoPorId = async (id: any) => {
    const existe = await Producto.findById(id);
    if (!existe) {
        throw new Error(`El id ${id} no existe`);
    }
}

export const coleccionesPermitidas = (coleccion:string, colecciones: string[]) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida. Colecciones ${colecciones}`);
    }
    return true;
}