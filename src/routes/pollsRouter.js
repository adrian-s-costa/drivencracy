import { Router } from "express";
import { postPolls, getPolls, postChoice } from '../controllers/pollsController.js'

const router = Router();

router.post('/poll', postPolls)
router.get('/poll', getPolls)
router.post('/choice', postChoice)

export default router;