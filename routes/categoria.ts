import { Router } from 'express';
import { check } from 'express-validator';

import {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
} from '../controllers/categorias';

import { existeCategoriaPorId } from '../helpers/db-validators';
import { esAdminRole } from '../middlewares/validar-roles';
import  validarJWT  from '../middlewares/validar-jwt';
import validarCampos from '../middlewares/validar-campos';


const router = Router();

//obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//obtener una categoria por id - publico
router.get('/:id',
    [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(id => existeCategoriaPorId(id)),
        validarCampos
    ], obtenerCategoria);

//crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//actualizar una categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(id => existeCategoriaPorId(id)),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

//borrar una categoria - privado - solo si es admin, pasa a estado = false
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(id => existeCategoriaPorId(id)),
    validarCampos
], borrarCategoria);

export default router;