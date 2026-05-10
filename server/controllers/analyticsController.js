const Blog = require('../models/Blog');

// Pipeline 1 — Blogs per author
const getBlogsPerAuthor = async (req, res, next) => {
  try {
    const data = await Blog.aggregate([
      {
        $group: {
          _id: '$authorName',
          count: { $sum: 1 },
          latestPost: { $max: '$createdDate' },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          author: '$_id',
          count: 1,
          latestPost: 1,
        },
      },
    ]);

    res.json({ success: true, data, message: 'Blogs per author fetched' });
  } catch (err) {
    next(err);
  }
};

// Pipeline 2 — Most used tags
const getTopTags = async (req, res, next) => {
  try {
    const data = await Blog.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          tag: '$_id',
          count: 1,
        },
      },
    ]);

    res.json({ success: true, data, message: 'Top tags fetched' });
  } catch (err) {
    next(err);
  }
};

// Pipeline 3 — Blogs in last 7 days
const getRecentBlogs = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const data = await Blog.aggregate([
      { $match: { createdDate: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ]);

    res.json({ success: true, data, message: 'Recent blogs fetched' });
  } catch (err) {
    next(err);
  }
};

// Pipeline 4 — Summary stats (BONUS — extra impress karega)
const getSummary = async (req, res, next) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const totalAuthors = await Blog.distinct('authorName');
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCount = await Blog.countDocuments({ createdDate: { $gte: sevenDaysAgo } });

    res.json({
      success: true,
      data: {
        totalBlogs,
        totalAuthors: totalAuthors.length,
        recentBlogs: recentCount,
      },
      message: 'Summary fetched',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBlogsPerAuthor, getTopTags, getRecentBlogs, getSummary };