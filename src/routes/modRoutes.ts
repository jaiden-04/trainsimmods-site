import { Router } from 'express';
import { ModController } from '../controllers/ModController';
import { authenticatePage } from '../middleware/authenticate';
import { upload } from '../middleware/fileUpload';

const router = Router();
const modController = new ModController();

router.get('/', modController.showAllMods);
router.get('/upload', authenticatePage, modController.showUploadForm);
router.post('/upload', authenticatePage, upload.single('file'), modController.upload);
router.get('/:slug', modController.showMod);
router.get('/:slug/download', modController.download);

export default router;