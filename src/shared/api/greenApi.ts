export type GreenApiCredentials = {
	idInstance: string
	apiTokenInstance: string
}

export type GreenApiNotification<TBody = unknown> = {
	receiptId: number
	body: TBody
}

export function createGreenApiClient({
	idInstance,
	apiTokenInstance
}: GreenApiCredentials) {
	const apiUrl =
		import.meta.env.VITE_GREEN_API_URL ?? 'https://4100.api.green-api.com'
	const baseUrl = `${apiUrl.replace(/\/$/, '')}/waInstance${encodeURIComponent(idInstance)}`
	const token = encodeURIComponent(apiTokenInstance)
	const request = async <T>(
		method: string,
		body?: unknown,
		query?: Record<string, string>
	): Promise<T> => {
		const url = new URL(
			`${baseUrl}/${method}/${encodeURIComponent(apiTokenInstance)}`
		)
		Object.entries(query ?? {}).forEach(([key, value]) =>
			url.searchParams.set(key, value)
		)
		const response = await fetch(url, {
			method: body ? 'POST' : 'GET',
			headers: body ? { 'Content-Type': 'application/json' } : undefined,
			body: body ? JSON.stringify(body) : undefined
		})
		if (!response.ok)
			throw new Error(`GREEN-API request failed: ${response.status}`)
		return response.json() as Promise<T>
	}

	return {
		configureHttpReceiving: () =>
			request<{ saveSettings: boolean }>('setSettings', {
				webhookUrl: '',
				incomingWebhook: 'yes',
				outgoingWebhook: 'yes',
				stateWebhook: 'yes'
			}),
		sendMessage: <T>(chatId: string, message: string) =>
			request<T>('sendMessage', { chatId, message }),
		receiveNotification: <T>(receiveTimeout = 30) =>
			request<T>('receiveNotification', undefined, {
				receiveTimeout: String(receiveTimeout)
			}),
		deleteNotification: async <T>(receiptId: number) => {
			const response = await fetch(
				`${baseUrl}/deleteNotification/${token}/${receiptId}`,
				{ method: 'DELETE' }
			)
			if (!response.ok)
				throw new Error(`GREEN-API request failed: ${response.status}`)
			return response.json() as Promise<T>
		}
	}
}
