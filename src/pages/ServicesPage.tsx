import React from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import Services from '@/components/Services';
import DynamicFooter from '@/components/DynamicFooter';
import SEOHead from '@/components/SEOHead';

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Oracle Consulting Services - ERP Implementation & Support"
        description="Comprehensive Oracle services: ERP implementation, AI-enhanced solutions, system customization, and 24/7 managed support. Transform your business with proven Oracle expertise."
        keywords="Oracle Services, Oracle ERP Implementation, Oracle Support, Oracle Customization, Oracle AI Solutions, Oracle Cloud Migration, Oracle Consulting Services"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/services` : ''}
      />
      <Header />
      <main>
        <HeroBanner
          pageName="services"
          defaultTitle="Comprehensive Oracle Solutions"
          defaultSubtitle="From implementation to optimization, we provide end-to-end Oracle consulting services that transform your business operations."
          defaultCtaText="View Services"
          defaultCtaLink="#services"
        />
        <Services />
      </main>
      <DynamicFooter />
    </div>
  );
};

export default ServicesPage;
