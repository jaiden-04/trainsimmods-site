import { Request, Response, NextFunction } from 'express';
import { ModService } from '../services/ModService';
import { CategoryService } from '../services/CategoryService';
import { ModRepository } from '../repositories/ModRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import path from 'path';

const modRepository = new ModRepository();
const categoryRepository = new CategoryRepository();
const modService = new ModService(modRepository);
const categoryService = new CategoryService(categoryRepository);

export class ModController {
  async showAllMods(request: Request, response: Response, next: NextFunction) {
    try {
      const mods = await modService.getAllMods();
      const categories = await categoryService.getAllCategories();
      
      const { ModVersionRepository } = await import('../repositories/ModVersionRepository');
      const modVersionRepository = new ModVersionRepository();
      
      const modsWithDownloads = await Promise.all(
        mods.map(async (mod) => {
          const versions = await modVersionRepository.findByModId(mod.id);
          const totalDownloads = versions.reduce((sum, v) => sum + v.downloadCount, 0);
          return { ...mod, totalDownloads };
        })
      );
      
      response.render('mods/index', { mods: modsWithDownloads, categories, user: request.user });
    } catch (error) {
      next(error);
    }
  }

  async showModsByCategory(request: Request, response: Response, next: NextFunction) {
    try {
      const category = await categoryService.getCategoryBySlug(request.params.slug);
      const mods = await modService.getModsByCategory(category.id);
      const categories = await categoryService.getAllCategories();
      
      const { ModVersionRepository } = await import('../repositories/ModVersionRepository');
      const modVersionRepository = new ModVersionRepository();
      
      const modsWithDownloads = await Promise.all(
        mods.map(async (mod) => {
          const versions = await modVersionRepository.findByModId(mod.id);
          const totalDownloads = versions.reduce((sum, v) => sum + v.downloadCount, 0);
          return { ...mod, totalDownloads };
        })
      );
      
      response.render('mods/category', { mods: modsWithDownloads, category, categories, user: request.user });
    } catch (error) {
      next(error);
    }
  }

  async showMod(request: Request, response: Response, next: NextFunction) {
    try {
      const mod = await modService.getModBySlug(request.params.slug);
      const { ModVersionRepository } = await import('../repositories/ModVersionRepository');
      const modVersionRepository = new ModVersionRepository();
      const versions = await modVersionRepository.findByModId(mod.id);
      
      const totalDownloads = versions.reduce((sum, v) => sum + v.downloadCount, 0);
      
      response.render('mods/show', { mod, versions, totalDownloads, user: request.user });
    } catch (error) {
      next(error);
    }
  }

  async showUploadForm(request: Request, response: Response) {
    const categories = await categoryService.getAllCategories();
    response.render('mods/upload', { categories, error: null, user: request.user });
  }

  async upload(request: Request, response: Response, next: NextFunction) {
    const uploadedFiles: string[] = [];
    try {
      const { title, description, categoryId, version, fileNames, fileGameVersions } = request.body;
      const user = request.user as any;
      const files = request.files as Express.Multer.File[];

      if (files) {
        uploadedFiles.push(...files.map(f => f.path));
      }

      const mod = await modService.createMod(
        user.id,
        title,
        description,
        categoryId ? parseInt(categoryId) : undefined,
        version
      );

      if (files && files.length > 0) {
        const { ModVersionRepository } = await import('../repositories/ModVersionRepository');
        const modVersionRepository = new ModVersionRepository();
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = Array.isArray(fileNames) ? fileNames[i] : fileNames;
          const gameVersion = Array.isArray(fileGameVersions) ? fileGameVersions[i] : fileGameVersions;
          
          await modVersionRepository.create({
            modId: mod.id,
            versionName: fileName || version || '1.0.0',
            gameVersion: gameVersion || null,
            filePath: file.path,
            fileSize: file.size,
          });
        }
        
        await modRepository.updateFile(mod.id, files[0].path, files[0].size);
      }

      response.json({ redirect: `/mods/${mod.slug}` });
    } catch (error) {
      for (const file of uploadedFiles) {
        const fs = await import('fs');
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }
      response.status(400).json({ error: (error as Error).message });
    }
  }

  async download(request: Request, response: Response, next: NextFunction) {
    try {
      const mod = await modService.getModBySlug(request.params.slug);
      
      if (!mod.filePath) {
        throw new Error('No file available for download');
      }

      await modService.recordDownload(mod.id);
      response.download(mod.filePath);
    } catch (error) {
      next(error);
    }
  }

  async showEdit(request: Request, response: Response, next: NextFunction) {
    try {
      const mod = await modService.getModBySlug(request.params.slug);
      const user = request.user as any;
      
      if (!user || user.id !== mod.userId) {
        return response.status(403).send('Forbidden');
      }

      const { ModVersionRepository } = await import('../repositories/ModVersionRepository');
      const modVersionRepository = new ModVersionRepository();
      const versions = await modVersionRepository.findByModId(mod.id);
      const categories = await categoryService.getAllCategories();
      
      response.render('mods/edit', { mod, versions, categories, error: null, user: request.user });
    } catch (error) {
      next(error);
    }
  }

  async editMod(request: Request, response: Response, next: NextFunction) {
    try {
      const mod = await modService.getModBySlug(request.params.slug);
      const user = request.user as any;
      
      if (!user || user.id !== mod.userId) {
        return response.status(403).send('Forbidden');
      }

      const { title, description, categoryId, version } = request.body;
      
      let newSlug = mod.slug;
      if (title !== mod.title) {
        newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const existing = await modRepository.findBySlug(newSlug);
        if (existing && existing.id !== mod.id) {
          newSlug = `${newSlug}-${Date.now()}`;
        }
      }
      
      await modRepository.update(mod.id, {
        title,
        slug: newSlug,
        description: description || null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        version: version || null,
      });

      response.redirect(`/mods/${newSlug}/edit`);
    } catch (error) {
      const { ModVersionRepository } = await import('../repositories/ModVersionRepository');
      const modVersionRepository = new ModVersionRepository();
      const mod = await modService.getModBySlug(request.params.slug);
      const versions = await modVersionRepository.findByModId(mod.id);
      const categories = await categoryService.getAllCategories();
      
      response.render('mods/edit', {
        mod,
        versions,
        categories,
        error: (error as Error).message,
        user: request.user,
      });
    }
  }

  async uploadVersion(request: Request, response: Response, next: NextFunction) {
    let uploadedFile: string | null = null;
    try {
      const mod = await modService.getModBySlug(request.params.slug);
      const user = request.user as any;
      
      if (!user || user.id !== mod.userId) {
        return response.status(403).json({ error: 'Forbidden' });
      }

      const { versionName, gameVersion } = request.body;
      
      if (!request.file) {
        throw new Error('No file uploaded');
      }

      uploadedFile = request.file.path;

      const { ModVersionRepository } = await import('../repositories/ModVersionRepository');
      const modVersionRepository = new ModVersionRepository();
      
      await modVersionRepository.create({
        modId: mod.id,
        versionName,
        gameVersion: gameVersion || null,
        filePath: request.file.path,
        fileSize: request.file.size,
      });

      response.json({ redirect: `/mods/${mod.slug}/edit` });
    } catch (error) {
      if (uploadedFile) {
        const fs = await import('fs');
        fs.unlinkSync(uploadedFile);
      }
      response.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteVersion(request: Request, response: Response, next: NextFunction) {
    try {
      const mod = await modService.getModBySlug(request.params.slug);
      const user = request.user as any;
      
      if (!user || user.id !== mod.userId) {
        return response.status(403).send('Forbidden');
      }

      const { ModVersionRepository } = await import('../repositories/ModVersionRepository');
      const modVersionRepository = new ModVersionRepository();
      
      await modVersionRepository.delete(parseInt(request.params.versionId));
      response.redirect(`/mods/${mod.slug}/edit`);
    } catch (error) {
      next(error);
    }
  }

  async downloadVersion(request: Request, response: Response, next: NextFunction) {
    try {
      const { ModVersionRepository } = await import('../repositories/ModVersionRepository');
      const modVersionRepository = new ModVersionRepository();
      
      const version = await modVersionRepository.findById(parseInt(request.params.versionId));
      
      if (!version) {
        throw new Error('Version not found');
      }

      await modVersionRepository.incrementDownloadCount(version.id);
      response.download(version.filePath);
    } catch (error) {
      next(error);
    }
  }

  async reportMod(request: Request, response: Response, next: NextFunction) {
    try {
      const mod = await modService.getModBySlug(request.params.slug);
      const user = request.user as any;
      
      if (!user) {
        return response.status(401).send('Unauthorized');
      }

      const { reason } = request.body;
      
      const { ReportRepository } = await import('../repositories/ReportRepository');
      const reportRepository = new ReportRepository();
      
      await reportRepository.create({
        modId: mod.id,
        reporterUserId: user.id,
        reason,
      });

      response.redirect(`/mods/${mod.slug}`);
    } catch (error) {
      next(error);
    }
  }
}