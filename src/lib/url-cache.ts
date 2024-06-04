const urlCache = new Map<string, string>();

export function url(url: string, value: string): string {
  if (!urlCache.has(url)) urlCache.set(url, value);
  return urlCache.get(url)!;
}

export function relativeTo(source: string, path: string): string {
  return source.replace(/\/(?:.(?!\/))+$/, '/' + path);
}
