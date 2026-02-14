import { pool } from '../database/pool';
import { Report, CreateReportData } from '../models/Report';

export class ReportRepository {
  async findAll(): Promise<Report[]> {
    const result = await pool.query(
      'SELECT id, mod_id as "modId", reporter_user_id as "reporterUserId", reason, status, created_at as "createdAt", resolved_at as "resolvedAt", resolved_by as "resolvedBy" FROM reports ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async findPending(): Promise<Report[]> {
    const result = await pool.query(
      'SELECT id, mod_id as "modId", reporter_user_id as "reporterUserId", reason, status, created_at as "createdAt", resolved_at as "resolvedAt", resolved_by as "resolvedBy" FROM reports WHERE status = $1 ORDER BY created_at DESC',
      ['pending']
    );
    return result.rows;
  }

  async create(data: CreateReportData): Promise<Report> {
    const result = await pool.query(
      'INSERT INTO reports (mod_id, reporter_user_id, reason) VALUES ($1, $2, $3) RETURNING id, mod_id as "modId", reporter_user_id as "reporterUserId", reason, status, created_at as "createdAt", resolved_at as "resolvedAt", resolved_by as "resolvedBy"',
      [data.modId, data.reporterUserId, data.reason]
    );
    return result.rows[0];
  }

  async updateStatus(id: number, status: string, resolvedBy: number): Promise<void> {
    await pool.query(
      'UPDATE reports SET status = $1, resolved_at = NOW(), resolved_by = $2 WHERE id = $3',
      [status, resolvedBy, id]
    );
  }
}