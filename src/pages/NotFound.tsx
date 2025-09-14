import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft, Search, Mail } from "lucide-react";
import Header from "@/components/Header";
import DynamicFooter from "@/components/DynamicFooter";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only log 404 errors for actual 404s, not base path redirects
    if (!location.pathname.includes('/oracle-fusion-vision/')) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Page Not Found (404) - Vijay Apps Consultants"
        description="The page you're looking for doesn't exist. Return to our Oracle consulting homepage or contact us for assistance."
        keywords="404, Page Not Found, Error, Oracle Consulting"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}${location.pathname}` : ''}
      />
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 lg:px-8 pt-20 lg:pt-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="destructive" className="mb-4">
              Error 404
            </Badge>
            <h1 className="text-6xl lg:text-8xl font-bold text-primary mb-4">
              404
            </h1>
            <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Sorry, we couldn't find the page you're looking for. The URL might be incorrect or the page may have been moved.
            </p>
          </div>

          <div className="mb-12">
            <p className="text-sm text-muted-foreground mb-6">
              Attempted URL: <code className="bg-muted px-2 py-1 rounded text-sm">{location.pathname}</code>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              onClick={() => navigate("/")}
              variant="default"
              size="lg"
              className="w-full sm:w-auto hover-lift"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Homepage
            </Button>

            <Button
              onClick={goBack}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-lg mx-auto">
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <Search className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Explore Our Services</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discover our Oracle consulting solutions
              </p>
              <Button
                onClick={() => navigate("/services")}
                variant="outline"
                size="sm"
                className="w-full"
              >
                View Services
              </Button>
            </div>

            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Get In Touch</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contact our Oracle experts for help
              </p>
              <Button
                onClick={() => navigate("/contact")}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </main>
      <DynamicFooter />
    </div>
  );
};

export default NotFound;
