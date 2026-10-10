import { useEffect, useMemo, useState } from 'react'
import type { Chat, ChatMessage } from '../../../entities/message'
import { NewChatDialog } from '../../../features/create-chat'
import {
	createGreenApiClient,
	type GreenApiCredentials,
	type GreenApiNotification
} from '../../../shared/api/greenApi'
import { getComparableChatId } from '../../../shared/lib/chat/chatId'
import { readIncomingMessage } from '../../../shared/lib/chat/notification'
import { ChatSidebar } from '../../../widgets/chat-sidebar'
import { ChatWindow } from '../../../widgets/chat-window'

type ChatPage = {
	credentials: GreenApiCredentials
	onDisconnect: () => void
}

const currentTime = () =>
	new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export function ChatPage({ credentials, onDisconnect }: ChatPage) {
	const api = useMemo(() => createGreenApiClient(credentials), [credentials])
	const [chats, setChats] = useState<Chat[]>([])
	const [activeChatId, setActiveChatId] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const [showNewChat, setShowNewChat] = useState(false)
	const [sendError, setSendError] = useState('')
	const [receiveError, setReceiveError] = useState('')

	useEffect(() => {
		let isMounted = true
		async function receiveMessages() {
			try {
				while (isMounted) {
					const notification =
						await api.receiveNotification<GreenApiNotification<
							Record<string, unknown>
						> | null>(30)
					if (!isMounted || !notification) continue
					const incomingMessage = readIncomingMessage(notification)
					if (incomingMessage) {
						const incomingChatMessage: ChatMessage = {
							id: String(notification.receiptId),
							text: incomingMessage.text,
							direction: 'incoming',
							time: currentTime()
						}
						setChats(current => {
							const existing = current.find(
								chat =>
									getComparableChatId(chat.id) ===
									getComparableChatId(incomingMessage.chatId)
							)
							if (existing)
								return current.map(chat =>
									chat.id === existing.id
										? {
												...chat,
												messages: [...chat.messages, incomingChatMessage]
											}
										: chat
								)
							return [
								...current,
								{ id: incomingMessage.chatId, messages: [incomingChatMessage] }
							]
						})
						setActiveChatId(current => current ?? incomingMessage.chatId)
					}
					await api.deleteNotification(notification.receiptId)
					setReceiveError('')
				}
			} catch (error) {
				if (isMounted) {
					setReceiveError(
						error instanceof Error
							? error.message
							: 'Не удалось получить сообщения'
					)
					window.setTimeout(receiveMessages, 3000)
				}
			}
		}
		api
			.configureHttpReceiving()
			.catch(() => {
				if (isMounted)
					setReceiveError(
						'Не удалось включить HTTP-получение. Проверьте настройки инстанса.'
					)
			})
			.finally(() => {
				if (isMounted) receiveMessages()
			})
		return () => {
			isMounted = false
		}
	}, [api])

	function openChat(newChatId: string) {
		setChats(current =>
			current.some(chat => chat.id === newChatId)
				? current
				: [...current, { id: newChatId, messages: [] }]
		)
		setActiveChatId(newChatId)
		setSendError('')
		setShowNewChat(false)
	}

	async function sendMessage(text: string) {
		if (!activeChatId) return
		try {
			await api.sendMessage<{ idMessage: string }>(activeChatId, text)
			const message: ChatMessage = {
				id: crypto.randomUUID(),
				text,
				direction: 'outgoing',
				time: currentTime()
			}
			setChats(current =>
				current.map(chat =>
					chat.id === activeChatId
						? { ...chat, messages: [...chat.messages, message] }
						: chat
				)
			)
			setSendError('')
		} catch {
			setSendError('Не удалось отправить сообщение')
		}
	}

	const activeChat = chats.find(chat => chat.id === activeChatId)
	return (
		<main className="h-screen overflow-hidden bg-[#dfe7eb]">
			<section className="flex h-full w-full bg-white">
				<ChatSidebar
					chats={chats}
					activeChatId={activeChatId}
					search={search}
					onSearchChange={setSearch}
					onNewChat={() => setShowNewChat(true)}
					onSelectChat={setActiveChatId}
					onDisconnect={onDisconnect}
				/>
				<ChatWindow
					chatId={activeChatId}
					messages={activeChat?.messages ?? []}
					error={sendError || receiveError}
					onNewChat={() => setShowNewChat(true)}
					onSendMessage={sendMessage}
				/>
			</section>
			{showNewChat && (
				<NewChatDialog
					onClose={() => setShowNewChat(false)}
					onChatCreated={openChat}
				/>
			)}
		</main>
	)
}
