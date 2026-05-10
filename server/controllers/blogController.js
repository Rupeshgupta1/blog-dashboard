const Blog = require('../models/Blog');

// GET all blogs with search + filter
const getBlogs = async (req, res, next) => {
  try {
    const { search, tags, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (tags) query.tags = { $in: tags.split(',').map(t => t.trim().toLowerCase()) };

    const skip = (page - 1) * limit;
    const blogs = await Blog.find(query).sort({ createdDate: -1 }).skip(skip).limit(Number(limit));
    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: { blogs, total, page: Number(page), totalPages: Math.ceil(total / limit) },
      message: 'Blogs fetched successfully',
    });
  } catch (err) {
    next(err);
  }
};

// POST create blog
const createBlog = async (req, res, next) => {
  try {
    const { title, description, tags } = req.body;

    if (!title || !description)
      return res.status(400).json({ success: false, data: null, message: 'Title and description required' });

    const blog = await Blog.create({
      title,
      description,
      tags: tags || [],
      authorName: req.user.name,
      authorId: req.user.id,
    });

    res.status(201).json({ success: true, data: blog, message: 'Blog created successfully' });
  } catch (err) {
    next(err);
  }
};

// PUT update blog
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog)
      return res.status(404).json({ success: false, data: null, message: 'Blog not found' });

    if (blog.authorId.toString() !== req.user.id)
      return res.status(403).json({ success: false, data: null, message: 'Not authorized' });

    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ success: true, data: updated, message: 'Blog updated successfully' });
  } catch (err) {
    next(err);
  }
};

// DELETE blog
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog)
      return res.status(404).json({ success: false, data: null, message: 'Blog not found' });

    if (blog.authorId.toString() !== req.user.id)
      return res.status(403).json({ success: false, data: null, message: 'Not authorized' });

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ success: true, data: null, message: 'Blog deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// GET single blog
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ success: false, data: null, message: 'Blog not found' });

    res.json({ success: true, data: blog, message: 'Blog fetched successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBlogs, createBlog, updateBlog, deleteBlog, getBlogById };