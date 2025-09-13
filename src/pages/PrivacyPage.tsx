import React from 'react';
import Header from '@/components/Header';
import DynamicFooter from '@/components/DynamicFooter';
import SEOHead from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy - Vijay Apps Consultants"
        description="Privacy policy for Vijay Apps Consultants. Learn how we collect, use, and protect your personal information and data."
        keywords="Privacy Policy, Data Protection, Personal Information, GDPR Compliance, Data Security"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/privacy` : ''}
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
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Vijay Apps Consultants ("we," "our," or "us") collects information you provide directly to us, such as when you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Fill out contact forms or request consultations</li>
                  <li>Subscribe to our newsletter or communications</li>
                  <li>Apply for job positions through our careers page</li>
                  <li>Interact with our website and services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Respond to your inquiries and provide customer service</li>
                  <li>Send you information about our Oracle consulting services</li>
                  <li>Process job applications and recruitment communications</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this privacy policy. We may share your information with trusted partners who assist us in operating our website and conducting our business, provided they agree to keep this information confidential.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our website may use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can choose to disable cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>The right to access and receive a copy of your personal information</li>
                  <li>The right to rectify inaccurate personal information</li>
                  <li>The right to erase your personal information</li>
                  <li>The right to restrict processing of your personal information</li>
                  <li>The right to data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-muted/50 rounded-lg p-6 mt-4">
                  <p className="font-semibold">Vijay Apps Consultants</p>
                  <p className="text-muted-foreground">Email: vijay_adina@vijayappsconsultants.com</p>
                  <p className="text-muted-foreground">Phone: +91 6303526930</p>
                  <p className="text-muted-foreground">Address: Flat#2201, Block 6, My Home Avatar, Narsingi, Hyderabad-500089</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
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

export default PrivacyPage;
