/**
 * SEO Metadata Generator
 * Helper functions to generate Open Graph, Twitter Card, and JSON-LD metadata
 */

export interface SeoMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'app';
  author?: string;
}

/**
 * Generate Open Graph meta tags
 */
export const generateOpenGraphTags = (metadata: SeoMetadata) => {
  return {
    'og:title': metadata.title,
    'og:description': metadata.description,
    'og:type': metadata.type || 'website',
    ...(metadata.image && { 'og:image': metadata.image }),
    ...(metadata.url && { 'og:url': metadata.url }),
  };
};

/**
 * Generate Twitter Card meta tags
 */
export const generateTwitterCardTags = (metadata: SeoMetadata) => {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': metadata.title,
    'twitter:description': metadata.description,
    ...(metadata.image && { 'twitter:image': metadata.image }),
  };
};

/**
 * Generate schema.org JSON-LD metadata
 */
export const generateJsonLdSchema = (metadata: SeoMetadata & { organizationName?: string }) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: metadata.title,
    description: metadata.description,
    url: metadata.url || 'https://fluentian.com',
    ...(metadata.image && { image: metadata.image }),
    applicationCategory: 'EducationalApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    ...(metadata.organizationName && {
      publisher: {
        '@type': 'Organization',
        name: metadata.organizationName,
      },
    }),
  };
};

/**
 * Predefined metadata for common pages
 */
export const PAGE_METADATA = {
  dashboard: {
    title: 'Dashboard | Fluentian Admin',
    description: 'Manage your language learning content and students',
    type: 'app' as const,
  },
  courses: {
    title: 'Courses | Fluentian Admin',
    description: 'Create and manage language learning courses',
    type: 'app' as const,
  },
  lessons: {
    title: 'Lessons | Fluentian Admin',
    description: 'Design and publish interactive language lessons',
    type: 'app' as const,
  },
  students: {
    title: 'Students | Fluentian Admin',
    description: 'Track student progress and engagement',
    type: 'app' as const,
  },
  analytics: {
    title: 'Analytics | Fluentian Admin',
    description: 'View detailed analytics and performance metrics',
    type: 'app' as const,
  },
};
