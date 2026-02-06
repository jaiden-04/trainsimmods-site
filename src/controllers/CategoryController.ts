import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/CategoryService';
import { CategoryRepository } from '../repositories/CategoryRepository';

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);

export class CategoryController {
  async showAll(request: Request, response: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      response.render('categories/index', { categories, user: request.user });
    } catch (error) {
      next(error);
    }
  }
}