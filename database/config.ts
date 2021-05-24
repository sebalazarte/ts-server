import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

const dbConnection = async () => {
    try {

        const cadenaConexion = process.env.MONGODB_CNN || '';
        await mongoose.connect(cadenaConexion, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos');
    }
}

export default dbConnection;
