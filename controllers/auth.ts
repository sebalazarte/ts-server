import { Request, Response } from 'express'
import Usuario from '../models/usuario';
import bcryptjs from 'bcryptjs';
import generarJWT from '../helpers/generarJWT';
import  googleVerify  from "../helpers/google-verify";

export const login = async (req: Request, res: Response) => {

    const { correo, password } = req.body;

    try {

        //verificar si el correo es valido
        var usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos. Usuario inexistente'
            });
        }

        //verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos. Usuario eliminado'
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos. Contraseña incorrecta'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        return res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

export const googleSignIn = async (req: Request, res: Response) => {

    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            //tengo que crearlo

            const data = {
                nombre,
                correo,
                password: ":P",
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador - usuario bloqueado'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es valido'
        });
    }


}
