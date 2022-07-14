import { Router } from "express";
import { postPolls, getPolls, postChoice, getPollChoice } from '../controllers/pollsController.js'

const router = Router();

router.post('/poll', postPolls)
router.get('/poll', getPolls)
router.post('/choice', postChoice)
router.get('/poll/:id/choice', getPollChoice)

export default router;