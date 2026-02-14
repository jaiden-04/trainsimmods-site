import { Router } from 'express';
import { ModController } from '../controllers/ModController';
import { authenticatePage } from '../middleware/authenticate';
import { upload } from '../middleware/fileUpload';
import { handleMulterError } from '../middleware/multerErrorHandler';

const router = Router();
const modController = new ModController();

router.get('/', modController.showAllMods);
router.get('/upload', authenticatePage, modController.showUploadForm);
router.post('/upload', authenticatePage, upload.array('files[]', 10), handleMulterError, modController.upload);
router.get('/:slug', modController.showMod);
router.get('/:slug/download', modController.download);
router.get('/:slug/edit', authenticatePage, modController.showEdit);
router.post('/:slug/edit', authenticatePage, modController.editMod);
router.post('/:slug/versions/upload', authenticatePage, upload.single('file'), handleMulterError, modController.uploadVersion);
router.post('/:slug/versions/:versionId/delete', authenticatePage, modController.deleteVersion);
router.get('/:slug/versions/:versionId/download', modController.downloadVersion);
router.post('/:slug/report', authenticatePage, modController.reportMod);

export default router;