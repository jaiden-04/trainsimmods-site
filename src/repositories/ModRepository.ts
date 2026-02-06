import { pool } from '../database/pool';
import { Mod, CreateModData } from '../models/Mod';

export class ModRepository {
  async findAll(): Promise<Mod[]> {
    const result = await pool.query(
      'SELECT id, user_id as "userId", category_id as "categoryId", title, slug, description, version, file_path as "filePath", file_size as "fileSize", download_count as "downloadCount", created_at as "createdAt", updated_at as "updatedAt" FROM mods ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async findById(id: number): Promise<Mod | null> {
    const result = await pool.query(
      'SELECT id, user_id as "userId", category_id as "categoryId", title, slug, description, version, file_path as "filePath", file_size as "fileSize", download_count as "downloadCount", created_at as "createdAt", updated_at as "updatedAt" FROM mods WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findBySlug(slug: string): Promise<Mod | null> {
    const result = await pool.query(
      'SELECT id, user_id as "userId", category_id as "categoryId", title, slug, description, version, file_path as "filePath", file_size as "fileSize", download_count as "downloadCount", created_at as "createdAt", updated_at as "updatedAt" FROM mods WHERE slug = $1',
      [slug]
    );
    return result.rows[0] || null;
  }

  async findByCategory(categoryId: number): Promise<Mod[]> {
    const result = await pool.query(
      'SELECT id, user_id as "userId", category_id as "categoryId", title, slug, description, version, file_path as "filePath", file_size as "fileSize", download_count as "downloadCount", created_at as "createdAt", updated_at as "updatedAt" FROM mods WHERE category_id = $1 ORDER BY created_at DESC',
      [categoryId]
    );
    return result.rows;
  }

  async create(data: CreateModData): Promise<Mod> {
    const result = await pool.query(
      'INSERT INTO mods (user_id, category_id, title, slug, description, version, file_path, file_size) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, user_id as "userId", category_id as "categoryId", title, slug, description, version, file_path as "filePath", file_size as "fileSize", download_count as "downloadCount", created_at as "createdAt", updated_at as "updatedAt"',
      [data.userId, data.categoryId || null, data.title, data.slug, data.description || null, data.version || null, data.filePath || null, data.fileSize || null]
    );
    return result.rows[0];
  }

  async incrementDownloadCount(id: number): Promise<void> {
    await pool.query(
      'UPDATE mods SET download_count = download_count + 1 WHERE id = $1',
      [id]
    );
  }
}