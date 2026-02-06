import { Request, Response, NextFunction } from 'express';
import { ModService } from '../services/ModService';
import { CategoryService } from '../services/CategoryService';
import { ModRepository } from '../repositories/ModRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import path from 'path';

const modRepository = new ModRepository();
const categoryRepository = new CategoryRepository();
const modService = new ModService(modRepository);
const categoryService = new CategoryService(categoryRepository);

export class ModController {
  async showAllMods(request: Request, response: Response, next: NextFunction) {
    try {
      const mods = await modService.getAllMods();
      const categories = await categoryService.getAllCategories();
      response.render('mods/index', { mods, categories, user: request.user });
    } catch (error) {
      next(error);
    }
  }

  async showModsByCategory(request: Request, response: Response, next: NextFunction) {
    try {
      const category = await categoryService.getCategoryBySlug(request.params.slug);
      const mods = await modService.getModsByCategory(category.id);
      const categories = await categoryService.getAllCategories();
      response.render('mods/category', { mods, category, categories, user: request.user });
    } catch (error) {
      next(error);
    }
  }

  async showMod(request: Request, response: Response, next: NextFunction) {
    try {
      const mod = await modService.getModBySlug(request.params.slug);
      response.render('mods/show', { mod, user: request.user });
    } catch (error) {
      next(error);
    }
  }

  async showUploadForm(request: Request, response: Response) {
    const categories = await categoryService.getAllCategories();
    response.render('mods/upload', { categories, error: null, user: request.user });
  }

  async upload(request: Request, response: Response, next: NextFunction) {
    try {
      const { title, description, categoryId, version } = request.body;
      const user = request.user as any;

      const mod = await modService.createMod(
        user.id,
        title,
        description,
        categoryId ? parseInt(categoryId) : undefined,
        version
      );

      if (request.file) {
        await modRepository.findById(mod.id);
        await modRepository.create({
          ...mod,
          filePath: request.file.path,
          fileSize: request.file.size,
        });
      }

      response.redirect(`/mods/${mod.slug}`);
    } catch (error) {
      const categories = await categoryService.getAllCategories();
      response.render('mods/upload', { 
        categories, 
        error: (error as Error).message,
        user: request.user 
      });
    }
  }

  async download(request: Request, response: Response, next: NextFunction) {
    try {
      const mod = await modService.getModBySlug(request.params.slug);
      
      if (!mod.filePath) {
        throw new Error('No file available for download');
      }

      await modService.recordDownload(mod.id);
      response.download(mod.filePath);
    } catch (error) {
      next(error);
    }
  }
}