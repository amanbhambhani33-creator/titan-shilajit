/**
 * Utility helpers for ultra-reliable image handling across Titan Shilajit store.
 * Resolves external URLs, Google Drive viewer links, Dropbox links, hotlinking blocks,
 * and provides resilient proxy fallback and server caching.
 */
import type React from 'react';


export const DEFAULT_PRODUCT_FALLBACK =
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80';

/**
 * Normalizes user-entered image URLs:
 * - Trims whitespace and quotes
 * - Converts Google Drive share/view links to direct high-res image stream URLs
 * - Converts Dropbox dl=0 preview links to raw=1 direct media
 * - Preserves local asset and upload paths
 */
export function normalizeImageUrl(rawUrl: string | undefined | null): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim().replace(/^["']|["']$/g, '');

  if (!url) return '';

  // Local uploads or assets
  if (url.startsWith('/') || url.startsWith('data:image')) {
    // If it contains /uploads/, ensure it starts with /uploads/
    if (url.includes('/uploads/')) {
      return url.substring(url.indexOf('/uploads/'));
    }
    return url;
  }

  // Google Drive URL transformations
  // Format 1: https://drive.google.com/file/d/FILE_ID/view...
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // Format 2: https://drive.google.com/open?id=FILE_ID or uc?id=FILE_ID
  const driveIdMatch = url.match(/drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  // Dropbox transformation: dl=0 -> raw=1
  if (url.includes('dropbox.com')) {
    if (url.includes('dl=0')) {
      return url.replace('dl=0', 'raw=1');
    }
    if (!url.includes('raw=1')) {
      url += (url.includes('?') ? '&' : '?') + 'raw=1';
    }
    return url;
  }

  return url;
}

/**
 * Returns a server proxy URL for any external image that might be blocked by CORS or Referer
 */
export function getProxyImageUrl(url: string): string {
  if (!url) return '';
  const clean = normalizeImageUrl(url);
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return `/api/proxy-image?url=${encodeURIComponent(clean)}`;
  }
  return clean;
}

/**
 * Handles image load errors gracefully by first attempting the server proxy,
 * and falling back to a default asset if the proxy also cannot retrieve it.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = DEFAULT_PRODUCT_FALLBACK
): void {
  const target = e.currentTarget;
  const originalSrc = target.getAttribute('src') || '';

  // First retry via server proxy if it's an external URL and hasn't tried proxy yet
  if (!target.dataset.triedProxy && (originalSrc.startsWith('http://') || originalSrc.startsWith('https://'))) {
    target.dataset.triedProxy = 'true';
    target.src = `/api/proxy-image?url=${encodeURIComponent(originalSrc)}`;
    return;
  }

  // If already tried proxy or it's a broken local path, switch to fallback
  target.onerror = null;
  target.src = fallback;
}

/**
 * Calls the server to permanently download and cache an external image URL to local server storage (/uploads/...)
 */
export async function downloadAndCacheImageUrl(
  url: string,
  prefix = 'product'
): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    const cleanUrl = normalizeImageUrl(url);
    if (!cleanUrl) return { success: false, url, error: 'Empty URL' };

    // Already a local path
    if (cleanUrl.startsWith('/') && !cleanUrl.startsWith('//')) {
      return { success: true, url: cleanUrl };
    }

    const res = await fetch('/api/cache-image-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: cleanUrl, prefix }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url) {
        return { success: true, url: data.url };
      }
    }
    return { success: false, url: cleanUrl, error: 'Failed to cache on server' };
  } catch (err: any) {
    return { success: false, url, error: err?.message || 'Network error caching image' };
  }
}
