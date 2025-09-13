import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 measurement ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = () => {
  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_title: document.title,
      page_location: window.location.href,
    });
  `;
  document.head.appendChild(script2);
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track business events
export const trackBusinessEvent = {
  contactFormSubmit: () => trackEvent('submit', 'contact', 'contact_form'),
  consultationRequest: () => trackEvent('request', 'business', 'consultation'),
  serviceInquiry: (service: string) => trackEvent('inquiry', 'services', service),
  jobApplication: (position: string) => trackEvent('apply', 'careers', position),
  downloadBrochure: () => trackEvent('download', 'marketing', 'service_brochure'),
  phoneCall: () => trackEvent('click', 'contact', 'phone_number'),
  emailClick: () => trackEvent('click', 'contact', 'email_address'),
};

// Analytics component that tracks route changes
const Analytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize GA on first load
    if (typeof window !== 'undefined' && !window.gtag) {
      initGA();
    }
  }, []);

  useEffect(() => {
    // Track page views on route changes
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null; // This component doesn't render anything
};

export default Analytics;