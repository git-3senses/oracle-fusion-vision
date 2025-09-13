import React from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import About from '@/components/About';
import Services from '@/components/Services';
import Careers from '@/components/Careers';
import Contact from '@/components/Contact';
import DynamicFooter from '@/components/DynamicFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner 
          pageName="home"
          defaultTitle="Transform Your Enterprise with Oracle Excellence"
          defaultSubtitle="Leading Oracle E-Business Suite & Fusion consulting firm delivering enterprise-grade solutions, AI-enhanced implementations, and strategic business transformation for global organizations."
        />
        <About />
        <Services />
        <Careers />
        <Contact />
      </main>
      <DynamicFooter />
    </div>
  );
};

export default Index;
