import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Analytics from "@/components/Analytics";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

const RootLayout = () => (
  <>
    <Analytics />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <SuspenseWrapper><Index /></SuspenseWrapper> },
      { path: "/about", element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
      { path: "/services", element: <SuspenseWrapper><ServicesPage /></SuspenseWrapper> },
      { path: "/careers", element: <SuspenseWrapper><CareersPage /></SuspenseWrapper> },
      { path: "/contact", element: <SuspenseWrapper><ContactPage /></SuspenseWrapper> },
      { path: "/auth", element: <SuspenseWrapper><AuthPage /></SuspenseWrapper> },
      { path: "/vac_admin", element: <SuspenseWrapper><AdminPanel /></SuspenseWrapper> },
      { path: "/privacy", element: <SuspenseWrapper><PrivacyPage /></SuspenseWrapper> },
      { path: "/terms", element: <SuspenseWrapper><TermsPage /></SuspenseWrapper> },
      { path: "/case-studies", element: <SuspenseWrapper><CaseStudiesPage /></SuspenseWrapper> },
      { path: "*", element: <SuspenseWrapper><NotFound /></SuspenseWrapper> },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
