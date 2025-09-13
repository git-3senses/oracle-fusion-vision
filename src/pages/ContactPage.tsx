import React from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import Contact from '@/components/Contact';
import DynamicFooter from '@/components/DynamicFooter';
import SEOHead from '@/components/SEOHead';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Oracle Consultants - Get Free Consultation"
        description="Contact Vijay Apps Consultants for Oracle consulting, implementation, and support. Get a free consultation from our certified Oracle experts. Quick response guaranteed."
        keywords="Contact Oracle Consultant, Oracle Consultation, Oracle Quote, Oracle Help, Oracle Support Contact, Oracle Implementation Quote"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/contact` : ''}
      />
      <Header />
      <main>
        <HeroBanner 
          pageName="contact"
          defaultTitle="Get In Touch"
          defaultSubtitle="Ready to transform your business? Let's discuss how our Oracle expertise can drive your digital transformation."
        />
        <Contact />
      </main>
      <DynamicFooter />
    </div>
  );
};

export default ContactPage;
