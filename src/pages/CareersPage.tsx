import React from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import Careers from '@/components/Careers';
import DynamicFooter from '@/components/DynamicFooter';

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner 
          pageName="careers"
          defaultTitle="Join Our Team"
          defaultSubtitle="Be part of a dynamic team shaping the future of Oracle consulting and enterprise solutions."
        />
        <Careers />
      </main>
      <DynamicFooter />
    </div>
  );
};

export default CareersPage;