// Get injected settings from Laravel (window.__APP_SETTINGS__)
export function getAppSettings() {
  if (typeof window === 'undefined') return {};
  if (window.__APP_SETTINGS__) return window.__APP_SETTINGS__;
  if (window.__BOOTSTRAP_DATA__ && window.__BOOTSTRAP_DATA__.settings) {
    return window.__BOOTSTRAP_DATA__.settings;
  }
  return {};
}
// Uniform image URL resolver for all frontend usage
const API_BASE = import.meta.env.VITE_API_URL || 'https://control.ilorinemirateyouths.com/api/v1';
const BACKEND_ORIGIN = API_BASE.replace(/\/api(\/v1)?\/?$/, '');
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image';

/**
 * Returns a fully qualified image URL for any backend or static image path.
 * - Absolute URLs (http, https, data) are returned as is.
 * - Relative paths (starting with /) are prefixed with backend origin.
 * - Empty or null returns a placeholder.
 * @param {string} imgPath
 * @returns {string}
 */
export function getImageUrl(imgPath) {
  if (!imgPath) return PLACEHOLDER_IMAGE;
  if (imgPath.startsWith('data:')) return imgPath;
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
  if (imgPath.startsWith('/')) return BACKEND_ORIGIN + imgPath;
  return BACKEND_ORIGIN + '/' + imgPath;
}
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
