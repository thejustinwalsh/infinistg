import {Assets, Cache} from 'pixi.js';

export function useAsset<T>(url: string): T {
  const asset = Cache.has(url) ? Assets.get<T>(url) : undefined;
  if (asset !== undefined) return asset;
  throw Assets.load(url);
}

export function useAssets<T>(urls: string[]): Record<string, T> {
  const assets = urls.reduce((prev, url) => prev && Cache.has(url), true) ? Assets.get<T>(urls) : undefined;
  if (assets !== undefined) return assets;
  throw Assets.load(urls);
}
