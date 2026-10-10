import type { GreenApiCredentials } from '../../api/greenApi'

const CREDENTIALS_KEY = 'green-api.credentials'

function readJson<T>(key: string): T | null {
	try {
		const value = localStorage.getItem(key)
		return value ? (JSON.parse(value) as T) : null
	} catch {
		localStorage.removeItem(key)
		return null
	}
}

export function loadCredentials() {
	return readJson<GreenApiCredentials>(CREDENTIALS_KEY)
}

export function saveCredentials(credentials: GreenApiCredentials) {
	localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials))
}

export function clearStoredSession() {
	localStorage.removeItem(CREDENTIALS_KEY)
}
