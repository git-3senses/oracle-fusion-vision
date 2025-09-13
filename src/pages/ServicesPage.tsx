import React from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner 
          pageName="services"
          defaultTitle="Comprehensive Oracle Solutions"
          defaultSubtitle="From implementation to optimization, we provide end-to-end Oracle consulting services that transform your business operations."
        />
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;