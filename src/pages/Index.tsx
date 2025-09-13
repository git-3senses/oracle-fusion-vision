import React from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import About from '@/components/About';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import Careers from '@/components/Careers';
import Contact from '@/components/Contact';
import DynamicFooter from '@/components/DynamicFooter';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Vijay Apps Consultants - Oracle E-Business Suite & Fusion Specialists"
        description="Transform your enterprise with Oracle excellence. Leading consulting firm delivering ERP implementations, AI-enhanced solutions, and digital transformation for 500+ global clients."
        keywords="Oracle ERP, Oracle Fusion, E-Business Suite, Oracle Consulting, Enterprise Implementation, Business Transformation, Oracle Support, Cloud Migration"
        canonicalUrl={typeof window !== 'undefined' ? window.location.origin : ''}
      />
      <Header />
      <main id="main-content">
        <HeroBanner 
          pageName="home"
          defaultTitle="Transform Your Enterprise with Oracle Excellence"
          defaultSubtitle="Leading Oracle E-Business Suite & Fusion consulting firm delivering enterprise-grade solutions, AI-enhanced implementations, and strategic business transformation for global organizations."
        />
        <About />
        <Services />
        <Testimonials />
        <Careers />
        <Contact />
      </main>
      <DynamicFooter />
    </div>
  );
};

export default Index;
