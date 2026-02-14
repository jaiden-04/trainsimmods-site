export interface ModVersion {
  id: number;
  modId: number;
  versionName: string;
  gameVersion: string | null;
  filePath: string;
  fileSize: number;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateModVersionData {
  modId: number;
  versionName: string;
  gameVersion?: string;
  filePath: string;
  fileSize: number;
}