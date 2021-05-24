import { Request, Response } from 'express'
import Categoria from '../models/categoria';

export const obtenerCategorias = async(req: Request, res: Response) => {

    //parametros del query string
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde)).limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    });
}

export const obtenerCategoria = async (req: Request, res: Response) => {

    //parametros del query string
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json({
        categoria
    });
}

export const crearCategoria = async (req: Request, res: Response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json({
        categoria
    });

}

export const actualizarCategoria = async(req: Request, res: Response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    const nombre = data.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe`
        });
    }

    data.nombre = nombre;
    data.usuario = req.usuario._id;
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        categoria
    });

}

export const borrarCategoria = async (req: Request, res: Response) => {

    const { id } = req.params;
    const usuarioAutenticado = req.usuario;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({ categoria, usuarioAutenticado });
}
