import React from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import Contact from '@/components/Contact';
import DynamicFooter from '@/components/DynamicFooter';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
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