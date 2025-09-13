import React from 'react';
import Header from '@/components/Header';
import Careers from '@/components/Careers';
import Footer from '@/components/Footer';

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <Careers />
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;