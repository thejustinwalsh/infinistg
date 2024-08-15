import {Assets, Cache} from 'pixi.js';

const cache = new Map<string, {error: unknown; retries: number}>();

export function reset(url: string): void {
  cache.delete(url);
}

export function useAsset<T>(url: string, options: {retryOnFailure?: boolean; maxRetries?: number} = {}): T {
  return useAssets<T>([url], options)[0];
}

export function useAssets<T>(
  urls: string[],
  {retryOnFailure = false, maxRetries = 3}: {retryOnFailure?: boolean; maxRetries?: number} = {},
): Record<string, T> {
  const assets = urls.reduce((prev, url) => prev && Cache.has(url), true) ? Assets.get<T>(urls) : undefined;
  if (assets !== undefined) return assets;

  // Rethrow the cached error if we are not retrying on failure or have reached the max retries
  const key = urls.join(',');
  const state = cache.get(key);
  if (state && (!retryOnFailure || state.retries > maxRetries)) throw state.error;

  // Load the asset and cache the error if it fails, throwing the promise to suspend the component
  throw Assets.load(urls).catch(error => {
    const state = cache.get(key) ?? {error, retries: 0};
    cache.set(key, {...state, error, retries: state.retries + 1});
  });
}
