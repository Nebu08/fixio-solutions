import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import SEO from '../components/ui/SEO';

export default function BlogPost() {
  const { id } = useParams();
  const { posts, addComment } = useBlog();
  const { currentUser } = useAuth();
  
  const [commentText, setCommentText] = useState('');
  
  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Publicación no encontrada</h2>
        <p style={{ marginBottom: '2rem' }}>El artículo que buscas no existe o ha sido eliminado.</p>
        <Link to="/blog"><Button variant="primary">Volver al Blog</Button></Link>
      </div>
    );
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const res = await addComment(post.id, commentText);
    
    if (res && res.success) {
      setCommentText('');
    } else {
      alert("No se pudo publicar el comentario. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="blog-post-page animate-fade-in" style={{ padding: '2rem 0 5rem' }}>
      <SEO title={post.title} description={post.excerpt} url={`/blog/${post.id}`} />
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: '500', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Volver al Blog
        </Link>
        
        <article className="post-article glass" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-surface-1)', marginBottom: '3rem' }}>
          {post.image && (
            <div style={{ height: '350px', width: '100%', overflow: 'hidden' }}>
              <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          
          <div style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <span>📅 {post.date}</span>
              <span>👤 {post.author}</span>
            </div>
            
            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '2rem', lineHeight: '1.2' }}>{post.title}</h1>
            
            <div className="post-content" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-primary)' }}>
              {post.content.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index} style={{ marginBottom: '1.5rem' }}>{paragraph}</p> : <br key={index} />
              ))}
            </div>
          </div>
        </article>
        
        <section className="comments-section glass" style={{ padding: '2rem', borderRadius: '16px', background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Comentarios ({post.comments?.length || 0})</h3>
          
          <div className="comments-list" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!post.comments || post.comments.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Sé el primero en comentar esta publicación.</p>
            ) : (
              post.comments.map(comment => (
                <div key={comment.id} className="comment" style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    <strong style={{ color: 'var(--color-primary)' }}>@{comment.author}</strong>
                    <span>{comment.date}</span>
                  </div>
                  <p style={{ margin: 0, lineHeight: '1.5' }}>{comment.text}</p>
                </div>
              ))
            )}
          </div>
          
          <div className="comment-form-container">
            {!currentUser ? (
              <div style={{ padding: '1.5rem', background: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center', border: '1px dashed var(--color-border)' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>Debes registrarte o iniciar sesión para poder dejar comentarios en nuestro blog.</p>
                <Link to="/login"><Button variant="primary">Iniciar Sesión</Button></Link>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontWeight: '600' }}>Dejar un comentario como @{currentUser.email.split('@')[0]}</label>
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escribe tu opinión aquí..."
                  rows="4"
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    resize: 'vertical',
                    outline: 'none',
                    background: 'var(--color-surface-1)'
                  }}
                  required
                />
                <div style={{ alignSelf: 'flex-end' }}>
                  <Button type="submit" variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={16} /> Publicar Comentario
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>
        
      </div>
    </div>
  );
}
