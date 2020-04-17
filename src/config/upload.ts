import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX'); // gera uma string hexadecimal aleatória
      const fileName = `${fileHash}-${file.originalname}`; // O nome do arquivo salvo será a string aleatória mais o nome original

      return callback(null, fileName);
    },
  }), // armazena no proprio HD
};
