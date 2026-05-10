import { create } from 'zustand';

interface Blog {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  authorName: string;
  createdDate: string;
}

interface BlogState {
  blogs: Blog[];
  total: number;
  page: number;
  search: string;
  selectedTag: string;
  setBlogs: (blogs: Blog[], total: number) => void;
  setSearch: (search: string) => void;
  setSelectedTag: (tag: string) => void;
  setPage: (page: number) => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  blogs: [],
  total: 0,
  page: 1,
  search: '',
  selectedTag: '',

  setBlogs: (blogs, total) => set({ blogs, total }),
  setSearch: (search) => set({ search, page: 1 }),
  setSelectedTag: (selectedTag) => set({ selectedTag, page: 1 }),
  setPage: (page) => set({ page }),
}));