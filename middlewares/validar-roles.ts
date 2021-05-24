import { NextFunction, Request, Response } from 'express';

export const esAdminRole = (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere vericar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;
    if (rol != "ADMIN_ROLE") {
        return res.status(401).json({
            msg: `${nombre} no es administrador`
        });
    }

    next();
}

export const tieneRol = (...roles: any[]) => {

    return (req: Request, res: Response, next: NextFunction) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere vericar el role sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles} `
            });
        }


        next();
    }

}