import express from 'express';
import { getHealthNews } from '../Controllers/HealthNewsControllers.js';

const router = express.Router();

router.get('/', getHealthNews);

export default router;
