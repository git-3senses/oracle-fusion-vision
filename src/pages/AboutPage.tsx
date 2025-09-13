import React from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import About from '@/components/About';
import DynamicFooter from '@/components/DynamicFooter';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner 
          pageName="about"
          defaultTitle="About Vijay Apps Consultants"
          defaultSubtitle="Your trusted Oracle transformation partner with 15+ years of expertise helping global organizations achieve digital transformation."
        />
        <About />
      </main>
      <DynamicFooter />
    </div>
  );
};

export default AboutPage;