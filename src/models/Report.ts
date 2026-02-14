export interface Report {
  id: number;
  modId: number;
  reporterUserId: number;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  resolvedAt: Date | null;
  resolvedBy: number | null;
}

export interface CreateReportData {
  modId: number;
  reporterUserId: number;
  reason: string;
}