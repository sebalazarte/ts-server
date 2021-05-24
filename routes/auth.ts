import { Router } from 'express';
import { check } from 'express-validator';
import validarCampos from '../middlewares/validar-campos';
import {login, googleSignIn} from '../controllers/auth';

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obigatoria').isEmail(),
    check('password', 'La contraseña es obligaroria').not().isEmpty(),
    validarCampos
], login)

router.post('/google', [
    check('id_token', 'El id_token es obligatorio').not().isEmpty(),
    validarCampos
], googleSignIn)

export default router;