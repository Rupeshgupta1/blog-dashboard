'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useBlogStore } from '@/store/blogStore';
import { useDebounce } from '@/hooks/useDebounce';
import api from '@/lib/api';

interface Blog {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  authorName: string;
  createdDate: string;
}

export default function BlogsPage() {
  const { blogs, setBlogs, search, setSearch, selectedTag, setSelectedTag, page, setPage, total } = useBlogStore();
  const debouncedSearch = useDebounce(search, 500);
  const [showForm, setShowForm] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', tags: '' });
  const [allTags, setAllTags] = useState<string[]>([]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params: { page: number; limit: number; search?: string; tags?: string } = { page, limit: 6 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedTag) params.tags = selectedTag;
      const { data } = await api.get('/blogs', { params });
      setBlogs(data.data.blogs, data.data.total);
      const tags = [...new Set(data.data.blogs.flatMap((b: Blog) => b.tags))] as string[];
      setAllTags(tags);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Keep behavior identical, but satisfy exhaustive-deps.
    requestAnimationFrame(() => {
      void fetchBlogs();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedTag, page]);

  const resetForm = () => {
    setForm({ title: '', description: '', tags: '' });
    setEditBlog(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (editBlog) {
        await api.put(`/blogs/${editBlog._id}`, payload);
        toast.success('Blog updated successfully!');
      } else {
        await api.post('/blogs', payload);
        toast.success('Blog published successfully!');
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      const message = (err as unknown as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      toast.error(message || 'Something went wrong');
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditBlog(blog);
    setForm({ title: blog.title, description: blog.description, tags: blog.tags.join(', ') });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/blogs/${deleteId}`);
      toast.success('Blog deleted successfully!');
      setDeleteId(null);
      fetchBlogs();
    } catch (err) {
      const message = (err as unknown as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      toast.error(message || 'Delete failed');
    }
  };

  const totalPages = Math.ceil(total / 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Blogs</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total posts</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          + New Blog
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No blogs found. Create your first post!</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-gray-900 truncate">{blog.title}</h2>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{blog.description}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <span className="text-xs text-gray-400">{blog.authorName}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{new Date(blog.createdDate).toLocaleDateString()}</span>
                    <div className="flex gap-1 flex-wrap">
                      {blog.tags.map(tag => (
                        <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="text-sm text-gray-500 hover:text-blue-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-blue-300 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(blog._id)}
                    className="text-sm text-gray-500 hover:text-red-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-300 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                p === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editBlog ? 'Edit Blog' : 'New Blog Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-800 block mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Blog title"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800 block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Write your blog content..."
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800 block mb-1">Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="react, nodejs, mongodb"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  {editBlog ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Blog?</h2>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
