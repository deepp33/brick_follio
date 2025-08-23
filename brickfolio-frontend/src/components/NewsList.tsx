import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  getNews, 
  filterNewsByCategory, 
  filterNewsByTag, 
  sortNewsByDate 
} from '../features/news/newsSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

export function NewsList() {
  const dispatch = useAppDispatch();
  const { news, loading, error } = useAppSelector((state) => state.news);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  useEffect(() => {
    dispatch(getNews());
  }, [dispatch]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category) {
      dispatch(filterNewsByCategory(category));
    } else {
      // Reset to original news
      dispatch(getNews());
    }
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    if (tag) {
      dispatch(filterNewsByTag(tag));
    } else {
      // Reset to original news
      dispatch(getNews());
    }
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
    dispatch(sortNewsByDate(order));
  };

  // Get unique categories and tags
  const categories = [...new Set(news.map(article => article.category))];
  const allTags = news.flatMap(article => article.tags);
  const uniqueTags = [...new Set(allTags)];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Tag</label>
          <Select value={selectedTag} onValueChange={handleTagFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              {uniqueTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Sort By Date</label>
          <Select value={sortOrder} onValueChange={handleSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <Card key={article._id} className="hover:shadow-lg transition-shadow">
            {article.images && article.images.length > 0 && (
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={article.images[0]}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">{article.category}</Badge>
                {article.isFeatured && (
                  <Badge variant="destructive">Featured</Badge>
                )}
              </div>
              <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
              <div className="flex gap-1 flex-wrap">
                {article.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{article.tags.length - 3} more
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {article.description}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>By {article.author}</span>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <Button className="w-full mt-4">Read More</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No news articles found.</p>
        </div>
      )}
    </div>
  );
}

