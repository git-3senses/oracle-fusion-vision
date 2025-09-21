# Oracle Fusion Vision - Project Documentation

## Table of Contents
1. [Project Vision](#project-vision)
2. [Tech Stack Overview](#tech-stack-overview)
3. [Project Structure](#project-structure)
4. [Database Architecture](#database-architecture)
5. [Key Features](#key-features)
6. [Component Architecture](#component-architecture)
7. [Routing & Navigation](#routing--navigation)
8. [Deployment & Infrastructure](#deployment--infrastructure)
9. [Development Workflow](#development-workflow)
10. [Security Implementation](#security-implementation)

---

## Project Vision

### Mission Statement
Oracle Fusion Vision is a comprehensive corporate website for **Vijay Apps Consultants**, an Oracle consulting firm specializing in E-Business Suite and Fusion implementations. The platform serves as a digital presence to showcase expertise, attract potential clients, and facilitate recruitment.

### Core Objectives
- **Establish Authority**: Position Vijay Apps Consultants as Oracle Certified Experts
- **Lead Generation**: Convert visitors into potential clients through strategic CTAs
- **Talent Acquisition**: Attract skilled Oracle professionals through dedicated career portals
- **Brand Consistency**: Maintain professional, modern design reflecting enterprise-grade services
- **User Experience**: Provide seamless navigation and responsive design across all devices

### Target Audience
- **Primary**: C-level executives and IT decision-makers seeking Oracle consulting services
- **Secondary**: Oracle professionals looking for career opportunities
- **Tertiary**: Partners and vendors in the Oracle ecosystem

---

## Tech Stack Overview

### Frontend Technologies
```typescript
React 18.3.1          // Core UI library with hooks and modern features
TypeScript 5.6.3      // Type-safe JavaScript for better development experience
Vite 5.4.10           // Lightning-fast build tool and development server
Tailwind CSS 3.4.13  // Utility-first CSS framework for rapid styling
```

### UI Component Libraries
```typescript
Radix UI              // Headless accessible components
shadcn/ui             // Pre-built component library based on Radix
Lucide React          // Modern icon library with 1000+ icons
```

### State Management & Data Fetching
```typescript
TanStack Query 5.59.16  // Server state management and caching
React Hook Form 7.53.2  // Performant form management
Zod 3.23.8              // Schema validation for TypeScript
```

### Backend & Database
```typescript
Supabase               // Backend-as-a-Service platform
PostgreSQL             // Relational database via Supabase
Row Level Security     // Database-level security implementation
Real-time subscriptions // Live data updates
```

### Routing & Navigation
```typescript
React Router DOM 6.27.0  // Client-side routing with future flags
Lazy Loading             // Code splitting for performance
```

### Development Tools
```typescript
ESLint                 // Code linting and quality enforcement
Prettier               // Code formatting
PostCSS                // CSS processing and optimization
Autoprefixer           // Automatic vendor prefixing
```

---

## Project Structure

```
oracle-fusion-vision/
├── public/                     # Static assets
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/                 # Images, fonts, media files
│   │   ├── hero-modern.jpg
│   │   ├── team-modern.jpg
│   │   └── oracle-modern.jpg
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   ├── Analytics.tsx       # Google Analytics integration
│   │   ├── Header.tsx          # Main navigation header
│   │   ├── Hero.tsx            # Homepage hero section
│   │   ├── HeroBanner.tsx      # Dynamic hero banners
│   │   ├── About.tsx           # About us section
│   │   ├── Services.tsx        # Services showcase
│   │   ├── Careers.tsx         # Career opportunities
│   │   ├── Contact.tsx         # Contact form and info
│   │   ├── Footer.tsx          # Site footer
│   │   └── AdminPanel.tsx      # Content management
│   ├── pages/                  # Route-level components
│   │   ├── Index.tsx           # Homepage
│   │   ├── AboutPage.tsx       # About us page
│   │   ├── ServicesPage.tsx    # Services page
│   │   ├── CareersPage.tsx     # Careers page
│   │   ├── ContactPage.tsx     # Contact page
│   │   ├── JobsPage.tsx        # Job listings
│   │   ├── SubmitResumePage.tsx # Resume submission
│   │   ├── PrivacyPage.tsx     # Privacy policy
│   │   ├── TermsPage.tsx       # Terms of service
│   │   └── NotFound.tsx        # 404 page
│   ├── contexts/               # React contexts
│   │   └── ThemeContext.tsx    # Theme management
│   ├── hooks/                  # Custom React hooks
│   │   └── use-toast.ts        # Toast notifications
│   ├── integrations/           # Third-party integrations
│   │   └── supabase/
│   │       ├── client.ts       # Supabase client configuration
│   │       └── types.ts        # Generated database types
│   ├── utils/                  # Utility functions
│   │   ├── settingsCache.ts    # Settings caching logic
│   │   └── bannerCache.ts      # Banner caching logic
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Application entry point
├── supabase/
│   ├── config.toml             # Supabase configuration
│   └── migrations/             # Database migrations
│       ├── 20250913144742_*.sql
│       ├── 20250920000001_create_resume_submissions.sql
│       └── 20250920000002_fix_hero_banner_cta_links.sql
├── .env.local                  # Environment variables
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite build configuration
```

---

## Database Architecture

### Database Platform: Supabase (PostgreSQL)

### Core Tables

#### 1. `hero_banners`
```sql
CREATE TABLE public.hero_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')) DEFAULT 'image',
  media_url TEXT,
  overlay_opacity DECIMAL(3,2) DEFAULT 0.7,
  text_color TEXT DEFAULT 'white',
  cta_text TEXT,
  cta_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### 2. `job_openings`
```sql
CREATE TABLE public.job_openings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL, -- Full-time, Part-time, Contract
  experience TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  description TEXT,
  requirements TEXT,
  is_urgent BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### 3. `resume_submissions`
```sql
CREATE TABLE public.resume_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience_years TEXT NOT NULL,
  oracle_skills TEXT NOT NULL,
  cover_letter TEXT NOT NULL,
  current_role TEXT,
  current_location TEXT,
  preferred_position TEXT,
  expected_salary TEXT,
  availability TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### 4. `site_settings`
```sql
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### 5. `contact_submissions`
```sql
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### Storage Buckets
- **`hero-media`**: Hero banner images and videos
- **`resumes`**: Uploaded resume files (PDF format)

### Row Level Security (RLS)
All tables implement RLS policies:
- **Public Read**: Anonymous users can read active content
- **Admin Management**: Only authenticated admins can modify data
- **Secure Uploads**: File uploads restricted to authenticated users

---

## Key Features

### 1. Dynamic Content Management
- **Hero Banners**: Customizable per-page hero sections with media upload
- **Site Settings**: Configurable theme colors, overlay opacity, and text settings
- **Admin Panel**: Real-time content updates without code deployment

### 2. Job Application System
- **Job Listings**: Dynamic job board with filtering capabilities
- **Split Layout**: Jobs list with detailed view panel
- **Resume Submission**: Multi-step form with file upload
- **Application Tracking**: Status management for HR processes

### 3. Responsive Design System
- **Mobile-First**: Optimized for all device sizes
- **Component Library**: Consistent design tokens and reusable components
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### 4. Performance Optimization
- **Code Splitting**: Lazy-loaded routes for faster initial load
- **Image Optimization**: Responsive images with proper sizing
- **Caching Strategy**: Client-side caching for settings and banners
- **SEO Optimization**: Meta tags, structured data, and semantic HTML

### 5. Analytics & Tracking
- **Google Analytics**: User behavior tracking and conversion monitoring
- **Business Events**: Custom event tracking for key user actions
- **Performance Monitoring**: Core Web Vitals and load time tracking

---

## Component Architecture

### Design Patterns
- **Composition over Inheritance**: Small, focused components
- **Hooks-Based**: Custom hooks for shared logic
- **Memoization**: React.memo for performance optimization
- **Error Boundaries**: Graceful error handling

### Key Components

#### 1. Layout Components
```typescript
// Header.tsx - Main navigation with responsive menu
const Header = () => {
  // Navigation state, theme switching, mobile menu
}

// Footer.tsx - Site footer with contact info and links
const Footer = () => {
  // Dynamic footer content from database
}
```

#### 2. Content Components
```typescript
// HeroBanner.tsx - Dynamic hero sections
interface HeroBannerProps {
  pageName: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  defaultCtaText?: string;
  defaultCtaLink?: string;
}

// Services.tsx - Service showcase with feature lists
const Services = memo(() => {
  // Service cards, CTAs, scroll navigation
});
```

#### 3. Form Components
```typescript
// Contact.tsx - Contact form with validation
const Contact = () => {
  // React Hook Form + Zod validation
  // Supabase integration for submissions
}

// SubmitResumePage.tsx - Multi-step resume submission
const SubmitResumePage = () => {
  // Stepper interface, file upload, form persistence
}
```

### State Management Strategy
- **Server State**: TanStack Query for API data
- **Form State**: React Hook Form for form management
- **Global State**: React Context for theme and settings
- **Local State**: useState for component-specific state

---

## Routing & Navigation

### Route Structure
```typescript
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/services", element: <ServicesPage /> },
      { path: "/careers", element: <CareersPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/jobs", element: <JobsPage /> },
      { path: "/submit-resume", element: <SubmitResumePage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/terms", element: <TermsPage /> },
      {
        path: "/vac_admin",
        element: (
          <RequireAuth>
            <AdminPanel />
          </RequireAuth>
        )
      },
      { path: "*", element: <NotFound /> }
    ]
  }
]);
```

### Navigation Features
- **Smooth Scrolling**: Section-based navigation on single pages
- **Breadcrumbs**: Clear navigation hierarchy
- **Active States**: Visual indication of current page
- **Mobile Menu**: Responsive hamburger navigation

---

## Deployment & Infrastructure

### Hosting Platform
- **Frontend**: Deployed on modern hosting platforms (Vercel/Netlify recommended)
- **Backend**: Supabase cloud infrastructure
- **Database**: PostgreSQL via Supabase
- **Storage**: Supabase Storage for file uploads

### Environment Configuration
```typescript
// .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GA_MEASUREMENT_ID=your_google_analytics_id
```

### Build Process
```bash
# Development
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Code quality checks
```

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

---

## Security Implementation

### Authentication & Authorization
- **Supabase Auth**: Secure user authentication
- **Row Level Security**: Database-level access control
- **Admin Verification**: Email-based admin validation
- **Admin Provisioning**: Accounts issued manually via Supabase invites; public signup disabled

#### Provisioning Checklist
1. **Disable Public Sign-Up**: In Supabase dashboard, Authentication → Providers → Email, disable “Allow new users to sign up.”
2. **Invite Admins**: Use Supabase Auth → Users → Invite user, or insert the account via SQL migration with the `admin` role metadata.
3. **Confirm Policies**: Ensure RLS policies grant read/write access only to authenticated admins (typically checking `auth.uid()` and `app_metadata.role`).
4. **Credential Rotation**: Remove Supabase accounts immediately if an admin leaves the organization.

### Data Protection
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **XSS Protection**: React's built-in XSS prevention
- **CSRF Protection**: Supabase CSRF tokens

### Privacy Compliance
- **GDPR Ready**: Privacy policy and data handling procedures
- **Cookie Policy**: Transparent cookie usage disclosure
- **Data Retention**: Configurable data retention policies

---

## Development Workflow

### Code Quality Standards
```typescript
// ESLint configuration for TypeScript
// Prettier for consistent formatting
// Husky for git hooks (optional)
// Conventional commits for changelog generation
```

### Testing Strategy
- **Component Testing**: React Testing Library
- **Type Safety**: TypeScript strict mode
- **E2E Testing**: Playwright (recommended for future implementation)

### Version Control
- **Git Flow**: Feature branches with pull requests
- **Semantic Versioning**: Major.minor.patch versioning
- **Automated Deployment**: CI/CD pipeline integration

### Development Best Practices
1. **Component-First Development**: Build reusable components
2. **Mobile-First Design**: Start with mobile layouts
3. **Progressive Enhancement**: Layer on advanced features
4. **Performance Budget**: Monitor bundle size and load times
5. **Accessibility First**: Include a11y from the start

---

## Future Enhancements

### Planned Features
- **Blog System**: Content marketing platform
- **Case Studies**: Detailed project showcases
- **Client Portal**: Secure client area
- **Multi-language Support**: Internationalization
- **Advanced Analytics**: Custom dashboard

### Technical Improvements
- **PWA Implementation**: Offline functionality
- **Advanced Caching**: Service worker implementation
- **Database Optimization**: Query optimization and indexing
- **CDN Integration**: Global content delivery
- **Monitoring**: Error tracking and performance monitoring

---

*Last Updated: September 2024*
*Version: 1.0.0*
*Maintained by: Vijay Apps Consultants Development Team*
