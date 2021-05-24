import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import Producto from '../models/producto';
import subirArchivo from '../helpers/subir-archivo';

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


export const cargarArchivo = async (req: Request, res: Response) => {

    try {
        const archivo = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ archivo });

    } catch (msg) {
        res.status(400).json({ msg });
    }

    //es lo mismo
    // subirArchivo(req.files)
    //     .then(archivo => {
    //         res.json({
    //             archivo
    //         })
    //     })
    //     .catch(err => {
    //         res.status(500).json({
    //             msg: err
    //         });
    //     })
}

export const actualizarImagen = async (req: Request, res: Response) => {

    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usurio con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500)
                .json({ msg: 'Se me olvido validar esto' });
    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();

    res.json(modelo);

}

export const actualizarImagenCloudinary = async (req: Request, res: Response) => {

    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usurio con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500)
                .json({ msg: 'Se me olvido validar esto' });
    }

    if (modelo.img) {
        const nombresArr = modelo.img.split('/');
        const nombre = nombresArr[nombresArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: `CafeNode/${coleccion}` });

    modelo.img = secure_url;
    await modelo.save();

    res.json(modelo);

}

export const mostrarImagen = async (req: Request, res: Response)=> {
    const { id, coleccion } = req.params;

    let modelo;

    const pathNoImagen = path.join(__dirname, '../assets/no-image.jpg');
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.sendFile(pathNoImagen);
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.sendFile(pathNoImagen);
            }
            break;

        default:
            return res.status(500)
                .json({ msg: 'Se me olvido validar esto' });
    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    res.sendFile(pathNoImagen);
}

