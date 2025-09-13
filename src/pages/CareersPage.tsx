import React from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import Careers from '@/components/Careers';
import DynamicFooter from '@/components/DynamicFooter';
import SEOHead from '@/components/SEOHead';

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Oracle Careers - Join Our Expert Consulting Team"
        description="Join Vijay Apps Consultants Oracle team. Exciting opportunities for Oracle developers, consultants, and specialists. Competitive benefits, remote work, and career growth."
        keywords="Oracle Jobs, Oracle Careers, Oracle Developer Jobs, Oracle Consultant Jobs, Oracle Employment, Oracle Fusion Jobs, Oracle EBS Jobs"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/careers` : ''}
      />
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
