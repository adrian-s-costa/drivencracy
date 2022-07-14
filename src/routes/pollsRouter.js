import { Router } from "express";
import { postPolls, getPolls, postChoice, getPollChoice, postChoiceVote, getPollResult } from '../controllers/pollsController.js'

const router = Router();

router.post('/poll', postPolls);
router.get('/poll', getPolls);
router.post('/choice', postChoice);
router.get('/poll/:id/choice', getPollChoice);
router.post('/choice/:id/vote', postChoiceVote);
router.get('/poll/:id/result', getPollResult)

export default router;