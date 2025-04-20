import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  url: string;
  created_at: string;
  created_by: string;
}

const Blogspot = () => {
  const { user } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    const { data, error } = await supabase
      .from('blogposts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setErrorMessage('Error fetching blog posts: ' + error.message);
    } else {
      setBlogPosts(data || []);
      setErrorMessage(null);
    }
  };

  const handleAddBlog = async () => {
    setErrorMessage(null);
    if (!user) {
      alert('You must be logged in to add blog posts.');
      return;
    }
    if (!newUrl || !newTitle) {
      alert('Please provide both title and Google Docs URL.');
      return;
    }
    // Basic validation for Google Docs URL
    if (!newUrl.includes('docs.google.com/document')) {
      alert('Please provide a valid Google Docs document URL.');
      return;
    }
    setLoading(true);
    const id = `${user.id}_${Date.now()}`;
    const { error } = await supabase
      .from('blogposts')
      .insert({
        id,
        title: newTitle,
        url: newUrl,
        created_by: user.id,
        created_at: new Date().toISOString(),
      });
    if (error) {
      setErrorMessage('Failed to add blog post: ' + error.message);
    } else {
      setNewUrl('');
      setNewTitle('');
      fetchBlogPosts();
    }
    setLoading(false);
  };

  const myBlogs = blogPosts.filter(post => post.created_by === user?.id);
  const otherBlogs = blogPosts.filter(post => post.created_by !== user?.id);

  return (
    <Layout title="Blogspot">
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6 text-helper-red">Blogspot</h1>
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded">
            {errorMessage}
          </div>
        )}
        {user && (
          <div className="mb-6 space-y-2">
            <input
              type="text"
              placeholder="Blog Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 text-black bg-white"
              disabled={loading}
            />
            <input
              type="url"
              placeholder="Google Docs URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 text-black bg-white"
              disabled={loading}
            />
            <Button onClick={handleAddBlog} disabled={loading}>
              {loading ? 'Adding...' : 'Add Blog'}
            </Button>
            <p className="text-sm text-gray-400 mt-2">
              Add your Google Docs blog URL here. Others can view it but only you can edit it via Google Docs.
            </p>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-helper-red">My Blogs</h2>
          {myBlogs.length === 0 ? (
            <p className="text-helper-red">You have not added any blogs yet.</p>
          ) : (
            <div className="space-y-4">
              {myBlogs.map((post) => (
                <Card key={post.id} className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors">
                  <CardHeader>
                    <CardTitle className="text-helper-red">{post.title}</CardTitle>
                    <CardDescription>Added on {new Date(post.created_at).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-helper-red underline"
                    >
                      View Blog on Google Docs
                    </a>
                    <p className="mt-2 text-sm text-gray-400">
                      You are the creator. Edit your blog directly in Google Docs.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-helper-red">Other Blogs</h2>
          {otherBlogs.length === 0 ? (
            <p className="text-helper-red">No other blogs available.</p>
          ) : (
            <div className="space-y-4">
              {otherBlogs.map((post) => (
                <Card key={post.id} className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors">
                  <CardHeader>
                    <CardTitle className="text-helper-red">{post.title}</CardTitle>
                    <CardDescription>Added on {new Date(post.created_at).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-helper-red underline"
                    >
                      View Blog on Google Docs
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Blogspot;
