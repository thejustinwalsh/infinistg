import {Assets, Cache} from 'pixi.js';

export function useAsset(url: string) {
  const asset = Cache.has(url) ? Assets.get(url) : undefined;
  if (asset !== undefined) return asset;
  throw Assets.load(url);
}
