import { Request, Response, NextFunction } from 'express';
import { ReportRepository } from '../repositories/ReportRepository';
import { ModRepository } from '../repositories/ModRepository';
import { UserRepository } from '../repositories/UserRepository';

const reportRepository = new ReportRepository();
const modRepository = new ModRepository();
const userRepository = new UserRepository();

export class AdminController {
  async showReports(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as any;
      
      if (!user || !user.isAdmin) {
        return response.status(403).send('Forbidden');
      }

      const filter = (request.query.status as string) || 'pending';
      
      let reports = filter === 'pending'
        ? await reportRepository.findPending()
        : await reportRepository.findAll();

      if (filter !== 'all' && filter !== 'pending') {
        reports = reports.filter(r => r.status === filter);
      }

      const reportsWithDetails = await Promise.all(
        reports.map(async (report) => {
          const mod = await modRepository.findById(report.modId);
          const reporter = await userRepository.findById(report.reporterUserId);
          return {
            ...report,
            modTitle: mod?.title || 'Unknown',
            modSlug: mod?.slug || '',
            reporterName: reporter?.displayName || reporter?.username || 'Unknown',
          };
        })
      );

      const allReports = await reportRepository.findAll();
      const pendingReports = await reportRepository.findPending();

      response.render('admin/reports', {
        reports: reportsWithDetails,
        filter,
        allCount: allReports.length,
        pendingCount: pendingReports.length,
        user: request.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async resolveReport(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as any;
      
      if (!user || !user.isAdmin) {
        return response.status(403).send('Forbidden');
      }

      await reportRepository.updateStatus(
        parseInt(request.params.id),
        'resolved',
        user.id
      );

      response.redirect('/admin/reports');
    } catch (error) {
      next(error);
    }
  }

  async dismissReport(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as any;
      
      if (!user || !user.isAdmin) {
        return response.status(403).send('Forbidden');
      }

      await reportRepository.updateStatus(
        parseInt(request.params.id),
        'dismissed',
        user.id
      );

      response.redirect('/admin/reports');
    } catch (error) {
      next(error);
    }
  }
}