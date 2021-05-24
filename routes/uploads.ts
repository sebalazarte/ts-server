import { Router } from 'express';
import { check } from 'express-validator';
import { cargarArchivo, actualizarImagenCloudinary, mostrarImagen } from '../controllers/uploads';
import  validarCampos from '../middlewares/validar-campos';
import validarArchivoSubir from '../middlewares/validar-archivo';
import { coleccionesPermitidas } from '../helpers/db-validators';

const router = Router();

router.post('/', [
    validarArchivoSubir,
    validarCampos],
    cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de MONGO').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de MONGO').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

export default router;