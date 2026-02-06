import { ModRepository } from '../repositories/ModRepository';
import { CreateModData } from '../models/Mod';

export class ModService {
  constructor(private modRepository: ModRepository) {}

  async getAllMods() {
    return await this.modRepository.findAll();
  }

  async getModById(id: number) {
    const mod = await this.modRepository.findById(id);
    if (!mod) {
      throw new Error('Mod not found');
    }
    return mod;
  }

  async getModBySlug(slug: string) {
    const mod = await this.modRepository.findBySlug(slug);
    if (!mod) {
      throw new Error('Mod not found');
    }
    return mod;
  }

  async getModsByCategory(categoryId: number) {
    return await this.modRepository.findByCategory(categoryId);
  }

  async createMod(userId: number, title: string, description: string, categoryId?: number, version?: string) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const existing = await this.modRepository.findBySlug(slug);
    if (existing) {
      throw new Error('Mod with this title already exists');
    }

    const data: CreateModData = {
      userId,
      title,
      slug,
      description,
      categoryId,
      version,
    };

    return await this.modRepository.create(data);
  }

  async recordDownload(id: number) {
    await this.modRepository.incrementDownloadCount(id);
  }
}