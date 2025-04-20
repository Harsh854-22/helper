import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  filename: string;
  url: string;
  created_at: string;
  created_by: string;
}

const Blogspot = () => {
  const { user } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [publicUrls, setPublicUrls] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    const fetchUrls = async () => {
      const urls: Record<string, string> = {};
      for (const post of blogPosts) {
        const { data } = supabase.storage.from('blogposts').getPublicUrl(post.url);
        if (data?.publicUrl) {
          urls[post.id] = data.publicUrl;
        }
      }
      setPublicUrls(urls);
    };
    if (blogPosts.length > 0) {
      fetchUrls();
    }
  }, [blogPosts]);

  const fetchBlogPosts = async () => {
    const { data, error } = await supabase
      .from('blogposts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching blog posts:', error.message);
      setErrorMessage('Error fetching blog posts: ' + error.message);
    } else {
      setBlogPosts(data || []);
      setErrorMessage(null);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (!user) {
      alert('You must be logged in to upload blog posts.');
      return;
    }
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      alert('Only DOCX files are allowed.');
      return;
    }
    setUploading(true);
    const filePath = `blogposts/${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('blogposts')
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      setErrorMessage('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }
    const { error: insertError } = await supabase
      .from('blogposts')
      .upsert({
        id: filePath,
        filename: file.name,
        url: filePath,
        created_by: user.id,
        created_at: new Date().toISOString(),
      });
    if (insertError) {
      setErrorMessage('Failed to save blog post metadata: ' + insertError.message + '. Please check your Supabase RLS policies.');
    } else {
      fetchBlogPosts();
    }
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <div className="mb-6">
            <input
              type="file"
              accept=".docx"
              onChange={handleFileUpload}
              ref={fileInputRef}
              disabled={uploading}
            />
            {uploading && <p className="text-helper-red">Uploading...</p>}
            <p className="text-sm text-gray-400 mt-2">
              Upload DOCX files as blog posts. To edit or remove a post, download it, make changes locally, and re-upload.
            </p>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-helper-red">My Blogs</h2>
          {myBlogs.length === 0 ? (
            <p className="text-helper-red">You have not uploaded any blogs yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBlogs.map((post) => (
                <Card key={post.id} className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors">
                  <CardHeader>
                    <CardTitle className="text-helper-red">{post.filename}</CardTitle>
                    <CardDescription>Uploaded on {new Date(post.created_at).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={publicUrls[post.id] || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-helper-red underline"
                    >
                      View / Download
                    </a>
                    <p className="mt-2 text-sm text-gray-400">
                      You are the creator. To edit or remove this post, download it, make changes locally, and re-upload.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherBlogs.map((post) => (
                <Card key={post.id} className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors">
                  <CardHeader>
                    <CardTitle className="text-helper-red">{post.filename}</CardTitle>
                    <CardDescription>Uploaded on {new Date(post.created_at).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={publicUrls[post.id] || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-helper-red underline"
                    >
                      View / Download
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
