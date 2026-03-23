import React from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import SEO from '../components/ui/SEO';
import './Blog.css'; // We will create this or use global styles

export default function Blog() {
  const { posts } = useBlog();

  return (
    <div className="blog-page animate-fade-in">
      <SEO title="Blog" description="Aprende y descubre novedades del mundo de la tecnología y el hogar inteligente." url="/blog" />
      <div className="container">
        <header className="page-header" style={{ textAlign: 'center', margin: '3rem 0' }}>
          <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Nuestro Blog</h1>
          <p className="page-subtitle" style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>Consejos, noticias y novedades del mundo de la tecnología.</p>
        </header>

        <div className="blog-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
          paddingBottom: '4rem'
        }}>
          {posts.length === 0 ? (
            <div className="empty-state text-center" style={{ gridColumn: '1 / -1', padding: '3rem', background: 'var(--color-surface-1)', borderRadius: '1rem' }}>
              <h3>No hay artículos publicados aún.</h3>
              <p>Vuelve pronto para leer nuestro contenido.</p>
            </div>
          ) : (
            posts.map(post => (
              <article key={post.id} className="blog-card glass" style={{
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform var(--transition-normal)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-1)'
              }}>
                {post.image && (
                  <div className="blog-card-img" style={{ height: '200px', overflow: 'hidden' }}>
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div className="blog-card-content" style={{ padding: '1.5rem' }}>
                  <div className="blog-meta" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    <span>{post.date}</span>
                    <span>{post.author}</span>
                  </div>
                  <h3 className="blog-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', lineHeight: '1.3' }}>{post.title}</h3>
                  <p className="blog-excerpt" style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="read-more-btn" style={{
                    color: 'var(--color-primary)',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'inline-block',
                    marginTop: '0.5rem'
                  }}>Leer artículo &rarr;</Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
