import { Router } from "express";
import { polls } from '../controllers/pollsController.js'

const router = Router();

router.post('/', polls)

export default router;