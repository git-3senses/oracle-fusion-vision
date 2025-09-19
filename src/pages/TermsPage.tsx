import React from 'react';
import Header from '@/components/Header';
import DynamicFooter from '@/components/DynamicFooter';
import SEOHead from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Terms of Service - Vijay Apps Consultants"
        description="Terms of service for Vijay Apps Consultants Oracle consulting services. Learn about our service terms, conditions, and policies."
        keywords="Terms of Service, Terms and Conditions, Service Agreement, Legal Terms, Oracle Consulting Terms"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/terms` : ''}
      />
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Legal Information
              </Badge>
              <h1 className="text-3xl lg:text-5xl font-bold mb-6">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using the Vijay Apps Consultants website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Services Description</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Vijay Apps Consultants provides Oracle consulting services including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Oracle E-Business Suite implementation and support</li>
                  <li>Oracle Fusion Cloud consulting and migration</li>
                  <li>Custom Oracle application development</li>
                  <li>AI-enhanced Oracle solutions</li>
                  <li>System integration and data migration services</li>
                  <li>Managed support and maintenance</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Service Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our consulting services are provided under the following terms:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Services are delivered according to agreed statements of work</li>
                  <li>Payment terms are Net 30 days unless otherwise specified</li>
                  <li>Intellectual property rights are defined in individual contracts</li>
                  <li>Confidentiality agreements protect client information</li>
                  <li>Service level agreements define performance expectations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All website content, including text, graphics, logos, images, and software, is the property of Vijay Apps Consultants or its content suppliers and is protected by intellectual property laws. Client-specific deliverables and custom developments are governed by individual service agreements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall Vijay Apps Consultants be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Professional Standards</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We maintain high professional standards in all our engagements:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>All consultants hold relevant Oracle certifications</li>
                  <li>We follow Oracle's best practices and methodologies</li>
                  <li>Quality assurance processes ensure deliverable standards</li>
                  <li>Continuous training keeps our team current with Oracle updates</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Either party may terminate services with written notice as specified in individual service agreements. Upon termination, all confidential information must be returned or destroyed as agreed.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-muted/50 rounded-lg p-6 mt-4">
                  <p className="font-semibold">Vijay Apps Consultants</p>
                  <p className="text-muted-foreground">Email: vijay_adina@vijayappsconsultants.com</p>
                  <p className="text-muted-foreground">Phone: +1 (440) 853-6416</p>
                  <p className="text-muted-foreground">Address: Flat#2201, Block 6, My Home Avatar, Narsingi, Hyderabad-500089</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <DynamicFooter />
    </div>
  );
};

export default TermsPage;
