import { pool } from '../database/pool';
import { ModVersion, CreateModVersionData } from '../models/ModVersion';

export class ModVersionRepository {
  async findByModId(modId: number): Promise<ModVersion[]> {
    const result = await pool.query(
      'SELECT id, mod_id as "modId", version_name as "versionName", game_version as "gameVersion", file_path as "filePath", file_size as "fileSize", download_count as "downloadCount", created_at as "createdAt", updated_at as "updatedAt" FROM mod_versions WHERE mod_id = $1 ORDER BY created_at DESC',
      [modId]
    );
    return result.rows;
  }

  async findById(id: number): Promise<ModVersion | null> {
    const result = await pool.query(
      'SELECT id, mod_id as "modId", version_name as "versionName", game_version as "gameVersion", file_path as "filePath", file_size as "fileSize", download_count as "downloadCount", created_at as "createdAt", updated_at as "updatedAt" FROM mod_versions WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateModVersionData): Promise<ModVersion> {
    const result = await pool.query(
      'INSERT INTO mod_versions (mod_id, version_name, game_version, file_path, file_size) VALUES ($1, $2, $3, $4, $5) RETURNING id, mod_id as "modId", version_name as "versionName", game_version as "gameVersion", file_path as "filePath", file_size as "fileSize", download_count as "downloadCount", created_at as "createdAt", updated_at as "updatedAt"',
      [data.modId, data.versionName, data.gameVersion || null, data.filePath, data.fileSize]
    );
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM mod_versions WHERE id = $1', [id]);
  }

  async incrementDownloadCount(id: number): Promise<void> {
    await pool.query(
      'UPDATE mod_versions SET download_count = download_count + 1 WHERE id = $1',
      [id]
    );
  }
}