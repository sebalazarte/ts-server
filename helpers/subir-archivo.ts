import path from 'path';
import { v4 } from 'uuid';

const subirArchivo = (files:any, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta:string) => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        //validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida. Permitidas: ${extensionesValidas}`);
        }

        const nombreTemp = v4() + "." + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, function (err:any) {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });

    })


}

export default subirArchivo;
