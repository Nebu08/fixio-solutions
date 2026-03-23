import { useEffect } from 'react';

export default function SEO({ title, description, url = '' }) {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title ? `${title} | Fixio Solutions` : 'Fixio Solutions | Tu Hogar Inteligente';
    document.title = fullTitle;

    // Helper to setup meta tags
    const setMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const defaultDesc = 'Encuentra los mejores productos y gadgets tecnológicos para facilitar tu día a día en Fixio Solutions. Calidad y utilidad garantizadas.';
    const finalDesc = description || defaultDesc;

    setMetaTag('description', finalDesc);
    setMetaTag('og:description', finalDesc, true);
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:type', 'website', true);
    
    // Semantic canonical URL
    if (url) {
      setMetaTag('og:url', `https://fixio-solutions.com${url}`, true);
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `https://fixio-solutions.com${url}`);
    }

  }, [title, description, url]);

  return null;
}
