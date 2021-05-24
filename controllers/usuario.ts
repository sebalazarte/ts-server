import { Request, Response } from 'express'
import Usuario from '../models/usuario';
import bcryptjs from 'bcryptjs';

export const getUsuarios = async (req: Request, res: Response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(Number(desde)).limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    });
}

export const getUsuario = async (req: Request, res: Response) => {

    const { id } = req.params;

    const usuario = await Usuario.findById(id);

    res.json({
        usuario
    });
}

export const postUsuario = async (req: Request, res: Response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.json({
        usuario
    });
}

export const putUsuario = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.json({
        usuario
    });
}

export const deleteUsuario = async (req: Request, res: Response) => {

    const { id } = req.params;
    
    const  usuarioAutenticado  = Object(req.usuario);
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({ usuario, usuarioAutenticado });
}