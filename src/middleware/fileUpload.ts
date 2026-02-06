import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'storage/uploads');
  },
  filename: (request, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, uniqueSuffix + path.extname(file.originalname));
  },
});

function fileFilter(request: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
  const allowedExtensions = ['.zip', '.rar', '.7z', '.pak'];
  const extension = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(extension)) {
    callback(null, true);
  } else {
    callback(new Error('Invalid file type. Only .zip, .rar, .7z, .pak allowed'));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
});