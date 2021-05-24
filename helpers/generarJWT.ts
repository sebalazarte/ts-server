import jwt from 'jsonwebtoken';

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };
        const key = process.env.SECRETORPRIVATEKEY || '';
        jwt.sign(payload, key, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        })
    });
}

export default generarJWT;