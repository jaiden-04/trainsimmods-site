import { CategoryRepository } from '../repositories/CategoryRepository';
import { CreateCategoryData } from '../models/Category';

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getAllCategories() {
    return await this.categoryRepository.findAll();
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async createCategory(name: string, description?: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const existing = await this.categoryRepository.findBySlug(slug);
    if (existing) {
      throw new Error('Category with this name already exists');
    }

    const data: CreateCategoryData = { name, slug, description };
    return await this.categoryRepository.create(data);
  }
}