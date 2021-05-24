import {Request, Response} from 'express';

const validarArchivoSubir = (req: Request, res: Response, next:any) => {
    
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'Ningun archivo fue subido'
        });
    }

    next();
}

export default validarArchivoSubir;