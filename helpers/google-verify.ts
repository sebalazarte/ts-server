import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async (idToken = '') => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });


    const {
        name: nombre, //renombro name por nombre
        picture: img,
        email: correo
    } = Object(ticket.getPayload());

    return { nombre, img, correo };
}

export default  googleVerify;