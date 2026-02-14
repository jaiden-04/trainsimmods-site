import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';

export function handleMulterError(error: any, request: Request, response: Response, next: NextFunction) {
  if (error instanceof multer.MulterError) {
    if (request.file?.path) {
      fs.unlinkSync(request.file.path);
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return response.status(400).json({ 
        error: 'File is too large. Maximum size is 500 MB.' 
      });
    }

    return response.status(400).json({ 
      error: error.message 
    });
  }

  if (error && request.file?.path) {
    fs.unlinkSync(request.file.path);
    return response.status(400).json({ 
      error: error.message || 'Upload failed' 
    });
  }

  next(error);
}