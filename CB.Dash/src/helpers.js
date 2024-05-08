export async function initCache() {
	const cache = localStorage.getItem('cache');
	if (!cache) localStorage.setItem('cache', btoa('{}'));
}

export async function getCacheItem(key) {
	const encoded = localStorage.getItem('cache');
	if (!encoded) await this.initCache();
	const cache = JSON.parse(atob(encoded));

	const item = cache[key];
	if (!item) return undefined;
	if (item.expires < Date.now()) {
		delete cache[key];
		localStorage.setItem('cache', JSON.stringify(cache));
		return undefined;
	}
	return item.data;

}

export async function setCacheItem(key, obj) {
	const encoded = localStorage.getItem('cache');
	if (!encoded) await this.initCache();
	const cache = JSON.parse(atob(encoded));

	const expires = Date.now() + 1000 * 60 * 60 * 24 * 7;
	const toCache = { expires, data: obj };
	cache[key] = toCache;

	localStorage.setItem('cache', btoa(JSON.stringify(cache)));

	if (process.env.NODE_ENV === 'development') {
		console.debug('cache', cache);
		localStorage.setItem('cache_decrypted', JSON.stringify(cache));
	}
}