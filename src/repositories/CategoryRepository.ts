import { pool } from '../database/pool';
import { Category, CreateCategoryData } from '../models/Category';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    const result = await pool.query(
      'SELECT id, name, slug, description, created_at as "createdAt" FROM categories ORDER BY name'
    );
    return result.rows;
  }

  async findById(id: number): Promise<Category | null> {
    const result = await pool.query(
      'SELECT id, name, slug, description, created_at as "createdAt" FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const result = await pool.query(
      'SELECT id, name, slug, description, created_at as "createdAt" FROM categories WHERE slug = $1',
      [slug]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const result = await pool.query(
      'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id, name, slug, description, created_at as "createdAt"',
      [data.name, data.slug, data.description || null]
    );
    return result.rows[0];
  }
}