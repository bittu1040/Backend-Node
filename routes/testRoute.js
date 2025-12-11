import express from 'express';

const router = express.Router();

// TEST ROUTE
router.get('/test', (req, res) => res.json({ ok: true, msg: 'test route' }));

export default router;