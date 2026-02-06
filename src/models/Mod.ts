export interface Mod {
  id: number;
  userId: number;
  categoryId: number | null;
  title: string;
  slug: string;
  description: string | null;
  version: string | null;
  filePath: string | null;
  fileSize: number | null;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateModData {
  userId: number;
  categoryId?: number;
  title: string;
  slug: string;
  description?: string;
  version?: string;
  filePath?: string;
  fileSize?: number;
}