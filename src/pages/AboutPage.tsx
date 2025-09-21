import React from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import About from '@/components/About';
import DynamicFooter from '@/components/DynamicFooter';
import SEOHead from '@/components/SEOHead';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Vijay Apps Consultants - Oracle Transformation Experts"
        description="20+ years of Oracle expertise with 10+ certified experts delivering transformation projects. Meet our Oracle consultants and learn about our proven methodology."
        keywords="Oracle Consultants, Oracle Experts, Oracle Team, Oracle Implementation Experience, Oracle Certified, Oracle Specialists"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/about` : ''}
      />
      <Header />
      <main>
        <HeroBanner
          pageName="about"
          defaultTitle="About Vijay Apps Consultants"
          defaultSubtitle="Your trusted Oracle transformation partner with 20+ years of expertise and 10+ certified experts helping global organizations achieve digital transformation."
          defaultCtaText="Learn More"
          defaultCtaLink="#about"
        />
        <About />
      </main>
      <DynamicFooter />
    </div>
  );
};

export default AboutPage;
