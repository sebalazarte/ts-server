import { Router } from 'express';
import { check } from 'express-validator';
import {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
} from '../controllers/productos';

import { existeCategoriaPorId, existeProductoPorId } from '../helpers/db-validators';
import { esAdminRole } from '../middlewares/validar-roles';
import validarJWT from '../middlewares/validar-jwt';
import validarCampos from '../middlewares/validar-campos';


const router = Router();

//obtener todas las productos - publico
router.get('/', obtenerProductos);

//obtener una producto por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(id => existeProductoPorId(id)),
    validarCampos
], obtenerProducto);

//crear producto - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'categoria no es un id valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//actualizar una producto - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(id => existeProductoPorId(id)),
    // check('categoria', 'categoria no es un id valido').isMongoId(),
    validarCampos
], actualizarProducto);

//borrar una producto - privado - solo si es admin, pasa a estado = false
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(id => existeProductoPorId(id)),
    validarCampos
], borrarProducto);

export default router;