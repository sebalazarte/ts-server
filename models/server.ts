import express, { Application } from 'express';
import cors from 'cors'
import dbConnection from '../database/config';
import fileUpload from 'express-fileupload';

import usuarioRoutes from '../routes/usuario';
import categoriaRoutes from '../routes/categoria';
import productoRoutes from '../routes/producto';
import authRoutes from '../routes/auth';
import searchRoutes from '../routes/buscar';
import uploadsRoutes from '../routes/uploads';


class Server {

    private app: Application;
    private port: String;
    private apiPaths = {
        auth: '/api/auth',
        buscar: '/api/buscar',
        categorias: '/api/categorias',
        productos: '/api/productos',
        usuarios: '/api/usuarios',
        uploads: '/api/uploads'
    };

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8000';

        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //cords
        this.app.use(cors());

        //lectura de body
        this.app.use(express.json());

        //carpeta publica+
        this.app.use(express.static('public'));

        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.apiPaths.auth, authRoutes);
        this.app.use(this.apiPaths.buscar, searchRoutes);
        this.app.use(this.apiPaths.categorias, categoriaRoutes);
        this.app.use(this.apiPaths.productos, productoRoutes);
        this.app.use(this.apiPaths.uploads, uploadsRoutes);
        this.app.use(this.apiPaths.usuarios, usuarioRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        })
    }
}

export default Server;