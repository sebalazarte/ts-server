import { Router } from 'express';
import { getUsuarios, getUsuario, postUsuario, putUsuario, deleteUsuario } from '../controllers/usuario';
import { check } from 'express-validator';
import validarCampos from '../middlewares/validar-campos';
import { existeEmail } from '../helpers/db-validators';
import validarJWT from '../middlewares/validar-jwt';

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', [
    check('id', 'Debe ser un id de mongo valido').isMongoId(),
    validarCampos
], getUsuario);
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mayor a 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(existeEmail),
    validarCampos
], postUsuario);
router.put('/:id', [
    check('id', 'Debe ser un id de mongo valido').isMongoId(),
    validarCampos
], putUsuario);
router.delete('/:id', [
    validarJWT,
    check('id', 'Debe ser un id de mongo valido').isMongoId(),
    validarCampos
], deleteUsuario);

export default router;