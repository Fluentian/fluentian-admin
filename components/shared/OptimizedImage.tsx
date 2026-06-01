/**
 * Optimized Image Component
 * Wrapper around Next.js Image for automatic optimization
 */

import Image, { ImageProps } from 'next/image';
import React from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
  alt: string;
  caption?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * OptimizedImage - Drop-in replacement for <img> tags
 * Provides:
 * - Automatic image optimization
 * - Responsive sizing
 * - Lazy loading by default
 * - WebP support
 * - AVIF support
 * - Accessibility with alt text
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  alt,
  caption,
  className = '',
  containerClassName = '',
  sizes,
  priority = false,
  placeholder = 'blur',
  blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  ...props
}: OptimizedImageProps) => {
  return (
    <figure className={containerClassName}>
      <Image
        alt={alt}
        className={className}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        {...props}
      />
      {caption && <figcaption className="text-sm text-gray-600 mt-2">{caption}</figcaption>}
    </figure>
  );
};

export default OptimizedImage;
