import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  current?: boolean;
}

const Breadcrumb: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    // Map paths to readable labels
    const pathLabels: Record<string, string> = {
      'about': 'About Us',
      'services': 'Services',
      'careers': 'Careers',
      'contact': 'Contact',
      'privacy': 'Privacy Policy',
      'terms': 'Terms of Service',
      'case-studies': 'Case Studies',
      'auth': 'Login',
      'vac_admin': 'Admin Panel'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const isLast = index === pathSegments.length - 1;

      breadcrumbs.push({
        label,
        path: currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page or if path is too short
  if (location.pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="bg-muted/30 border-b border-border" aria-label="Breadcrumb">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center py-4">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <li key={item.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground mx-2 flex-shrink-0" />
                )}

                {item.current ? (
                  <span
                    className="text-foreground font-medium truncate"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <button
                    onClick={() => navigate(item.path)}
                    className="text-muted-foreground hover:text-primary transition-colors hover:underline flex items-center"
                  >
                    {index === 0 && (
                      <Home className="h-4 w-4 mr-1 flex-shrink-0" />
                    )}
                    <span className="truncate">{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;