import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario';

const validarJWT = async (req: Request, res: Response, next:any) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay un token en la peticion'
        });
    }
    try {

        const key = process.env.SECRETORPRIVATEKEY || '';
        const { uid } = Object(jwt.verify(token, key));
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token invalido'
        });
    }
}

export default validarJWT;