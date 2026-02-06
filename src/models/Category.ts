export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
}