import { createContext, useContext, useState, useEffect } from 'react';
import { getBlogs, createBlog as apiCreateBlog, updateBlog as apiUpdateBlog, deleteBlog as apiDeleteBlog, createBlogComment } from '../services/api';

const BlogContext = createContext();

export function useBlog() {
  return useContext(BlogContext);
}

const INITIAL_POSTS = [
  { 
    id: 'post-1', 
    title: '5 gadgets imprescindibles para tu hogar inteligente en 2026', 
    excerpt: 'Descubre cómo transformar tu casa en un hogar inteligente con estos 5 dispositivos esenciales que te harán la vida más fácil.',
    content: 'El hogar inteligente ya no es cosa del futuro. Hoy en día, la domótica está al alcance de todos y puede hacernos la vida mucho más cómoda y segura. Aquí te presentamos 5 gadgets que no pueden faltar en tu casa: \n\n1. Asistente de voz\n2. Bombillas inteligentes\n3. Enchufes WiFi\n4. Cerraduras electrónicas\n5. Cámaras de vigilancia indoor y outdoor.', 
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop', 
    date: '2026-03-20', 
    author: 'Equipo Fixio',
    comments: [
      { id: 'com-1', author: 'juan.perez', text: '¡Excelente artículo! Muy buenos consejos.', date: '2026-03-20' }
    ]
  },
  { 
    id: 'post-2', 
    title: 'Cómo mejorar la seguridad de tu red WiFi paso a paso', 
    excerpt: 'Protege tus dispositivos y tus datos personales configurando correctamente el router de tu hogar.',
    content: 'La seguridad de nuestra red doméstica es fundamental para proteger nuestra información. Te recomendamos cambiar la contraseña por defecto de tu router, ocultar el nombre de la red (SSID) y usar encriptación WPA3 si es posible. No olvides mantener actualizado el firmware de tus dispositivos.', 
    image: 'https://images.unsplash.com/photo-1614088927878-83177722d3e4?q=80&w=800&auto=format&fit=crop', 
    date: '2026-03-18', 
    author: 'Equipo Fixio',
    comments: []
  }
];
export function BlogProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load blogs from backend
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setPosts(data);
      } catch(err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const addPost = async (postData) => {
    try {
      const newPost = await apiCreateBlog(postData);
      setPosts(prev => [newPost, ...prev]);
    } catch(err) {
      console.error(err);
      throw err;
    }
  };

  const updatePost = async (id, updatedData) => {
    try {
      const updatedPost = await apiUpdateBlog(id, updatedData);
      setPosts(prev => prev.map(p => p.id === id ? updatedPost : p));
    } catch(err) {
      console.error(err);
      throw err;
    }
  };

  const deletePost = async (id) => {
    try {
      await apiDeleteBlog(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch(err) {
      console.error(err);
      throw err;
    }
  };

  const addComment = async (postId, content) => {
    try {
      const newComment = await createBlogComment(postId, content);
      
      // La API nos devuelve el comentario recién creado, ahora actualizamos el estado local
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const newComments = p.comments ? [...p.comments] : [];
          // El backend debió guardar id, user_name, content, created_at
          newComments.push({
            id: newComment.id,
            author: newComment.user_name,
            text: newComment.content,
            date: newComment.created_at
          });
          return { ...p, comments: newComments };
        }
        return p;
      }));
      return { success: true };
    } catch (err) {
      console.error('Error adding comment:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <BlogContext.Provider value={{
      posts,
      addPost,
      updatePost,
      deletePost,
      addComment
    }}>
      {!loading && children}
    </BlogContext.Provider>
  );
}
