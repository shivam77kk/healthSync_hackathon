import express from 'express';
import { getHealthNews } from '../Controllers/NewsControllers.js';

const router = express.Router();

router.get('/health-news', getHealthNews);

export default router;