import { Request, Response } from 'express'
import { Types } from 'mongoose'
import Usuario from '../models/usuario';
import Categoria from '../models/categoria';
import Producto from '../models/producto';

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]


const buscarUsuarios = async (termino: string, res: Response) => {

    const esMongoID = Types.ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    res.json({
        results: [
            usuarios
        ]
    });

}

const buscarCategorias = async (termino: string, res: Response) => {
    const esMongoID = Types.ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria
            .findById(termino)
            .populate('usuario', 'nombre');
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex }).populate('usuario', 'nombre');;
    res.json({
        results: [
            categorias
        ]
    });

}

const buscarProductos = async (termino:string, res: Response) => {
    const esMongoID = Types.ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto
            .findById(termino)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{ nombre: regex }, { descripcion: regex }],
        $and: [{ estado: true }]
    }).populate('categoria', 'nombre')
        .populate('usuario', 'nombre');

    res.json({
        results: [
            productos
        ]
    });

}
const buscar = (req: Request, res: Response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'No esta implementada esta opcion'
            })
    }
}

export default buscar;