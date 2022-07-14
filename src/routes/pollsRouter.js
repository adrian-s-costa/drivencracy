import { Router } from "express";
import { postPolls, getPolls, postChoice, getPollChoice, postChoiceVote, getPollResult } from '../controllers/pollsController.js'

const router = Router();

router.post('https://api-drivencracy-a.herokuapp.com/poll', postPolls);
router.get('https://api-drivencracy-a.herokuapp.com/poll', getPolls);
router.post('https://api-drivencracy-a.herokuapp.com/choice', postChoice);
router.get('https://api-drivencracy-a.herokuapp.com/poll/:id/choice', getPollChoice);
router.post('https://api-drivencracy-a.herokuapp.com/choice/:id/vote', postChoiceVote);
router.get('https://api-drivencracy-a.herokuapp.com/poll/:id/result', getPollResult)

export default router;