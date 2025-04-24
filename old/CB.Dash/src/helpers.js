import { Base64 } from 'js-base64';

export async function initCache() {
	const cache = localStorage.getItem('cache');
	// if (!cache) localStorage.setItem('cache', btoa('{}'));
	if (!cache) localStorage.setItem('cache', Base64.encode('{}'));
}

export async function getCacheItem(key) {
	const encoded = localStorage.getItem('cache');
	if (!encoded) await this.initCache();
	// const cache = JSON.parse(atob(encoded));
	const cache = JSON.parse(Base64.decode(encoded));

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
	// const cache = JSON.parse(atob(encoded));
	const cache = JSON.parse(Base64.decode(encoded));

	const expires = Date.now() + 1000 * 60 * 60 * 24 * 7;
	const toCache = { expires, data: obj };
	cache[key] = toCache;

	// localStorage.setItem('cache', btoa(JSON.stringify(cache)));
	localStorage.setItem('cache', Base64.encode(JSON.stringify(cache)));

	if (process.env.NODE_ENV === 'development') {
		console.debug('cache', cache);
		localStorage.setItem('cache_decrypted', JSON.stringify(cache));
	}
}
