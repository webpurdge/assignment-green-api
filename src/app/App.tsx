import { useState } from 'react'
import { CredentialsForm } from '../features/auth'
import { ChatPage } from '../pages/chat'
import type { GreenApiCredentials } from '../shared/api/greenApi'
import {
	clearStoredSession,
	loadCredentials,
	saveCredentials
} from '../shared/lib/storage/chatStorage'

export default function App() {
	const [credentials, setCredentials] = useState<GreenApiCredentials | null>(
		loadCredentials
	)

	function handleConnected(nextCredentials: GreenApiCredentials) {
		saveCredentials(nextCredentials)
		setCredentials(nextCredentials)
	}

	function handleDisconnect() {
		clearStoredSession()
		setCredentials(null)
	}

	return credentials ? (
		<ChatPage
			credentials={credentials}
			onDisconnect={handleDisconnect}
		/>
	) : (
		<CredentialsForm onConnected={handleConnected} />
	)
}
