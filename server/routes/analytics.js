const express = require('express');
const router = express.Router();
const {
  getBlogsPerAuthor,
  getTopTags,
  getRecentBlogs,
  getSummary,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/per-author', protect, getBlogsPerAuthor);
router.get('/top-tags', protect, getTopTags);
router.get('/recent', protect, getRecentBlogs);
router.get('/summary', protect, getSummary);

module.exports = router;