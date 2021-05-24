import { Request, Response } from 'express'
import Producto from '../models/producto';

export const obtenerProductos = async (req: Request, res: Response) => {

    //parametros del query string
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde)).limit(Number(limite))
    ])

    res.json({
        total,
        productos
    });
}

export const obtenerProducto = async (req: Request, res: Response) => {

    //parametros del query string
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        producto
    });
}

export const crearProducto = async (req: Request, res: Response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });
    if (productoDB) {
        return res.status(400).json({
            msg: `La producto ${body.nombre} ya existe`
        });
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json({
        producto
    });

}

export const actualizarProducto = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        const nombre = data.nombre.toUpperCase();

        const productoDB = await Producto.findOne({ nombre });
        if (productoDB) {
            return res.status(400).json({
                msg: `La producto ${nombre} ya existe`
            });
        }

        data.nombre = nombre;
    }

    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        producto
    });

}

export const borrarProducto = async (req: Request, res: Response) => {

    const { id } = req.params;
    const usuarioAutenticado = req.usuario;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({ producto, usuarioAutenticado });
}
