import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Vijay Apps Consultants - Oracle E-Business Suite & Fusion Consulting",
  description = "Leading Oracle E-Business Suite & Fusion consulting firm delivering enterprise-grade solutions, AI-enhanced implementations, and strategic business transformation for global organizations.",
  keywords = "Oracle ERP, Oracle Fusion, E-Business Suite, Oracle Consulting, Enterprise Software, Business Transformation, Oracle Implementation, AI-Enhanced Solutions",
  ogTitle,
  ogDescription,
  canonicalUrl
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    // Update Open Graph title
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', ogTitle || title);
    }

    // Update Open Graph description
    const ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', ogDescription || description);
    }

    // Add canonical URL if provided
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // Update Open Graph URL
    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta && canonicalUrl) {
      ogUrlMeta.setAttribute('content', canonicalUrl);
    } else if (!ogUrlMeta && canonicalUrl) {
      const newOgUrl = document.createElement('meta');
      newOgUrl.setAttribute('property', 'og:url');
      newOgUrl.setAttribute('content', canonicalUrl);
      document.head.appendChild(newOgUrl);
    }
  }, [title, description, keywords, ogTitle, ogDescription, canonicalUrl]);

  return null; // This component doesn't render anything
};

export default SEOHead;