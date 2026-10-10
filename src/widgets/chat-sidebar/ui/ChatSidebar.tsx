import type { Chat } from '../../../entities/message'
import { getPhoneNumber } from '../../../shared/lib/chat/chatId'

type ChatSidebar = {
	chats: Chat[]
	activeChatId: string | null
	search: string
	onSearchChange: (value: string) => void
	onNewChat: () => void
	onSelectChat: (chatId: string) => void
	onDisconnect: () => void
}

export function ChatSidebar({
	chats,
	activeChatId,
	search,
	onSearchChange,
	onNewChat,
	onSelectChat,
	onDisconnect
}: ChatSidebar) {
	const searchDigits = search.replace(/\D/g, '')
	const visibleChats = chats.filter(chat =>
		getPhoneNumber(chat.id).includes(searchDigits)
	)

	return (
		<aside className="flex w-full max-w-95 shrink-0 flex-col border-r border-[#d8e0e5] bg-white">
			<header className="flex h-15.5 items-center gap-3 border-b border-[#e2e8eb] px-4">
				<input
					aria-label="Поиск"
					value={search}
					onChange={evt => onSearchChange(evt.target.value)}
					className="min-w-0 flex-1 rounded-lg bg-[#f1f3f5] px-3 py-2 text-sm outline-none"
					placeholder="Поиск"
				/>
				<button
					aria-label="Новый чат"
					onClick={onNewChat}
					className="grid size-10 place-items-center rounded-full text-2xl text-[#168f83] hover:bg-[#e8f5f2]"
				>
					＋
				</button>
			</header>
			<div className="flex-1 overflow-y-auto">
				{visibleChats.length ? (
					visibleChats.map(chat => {
						const phoneNumber = getPhoneNumber(chat.id)
						const lastMessage = chat.messages.at(-1)?.text ?? 'Нет сообщений'
						return (
							<button
								key={chat.id}
								className={`flex w-full items-center gap-3 border-b border-[#eef1f3] px-4 py-3 text-left hover:bg-[#dff1ed] ${chat.id === activeChatId ? 'bg-[#e7f5f2]' : ''}`}
								onClick={() => onSelectChat(chat.id)}
							>
								<span className="grid size-11 place-items-center rounded-full bg-[#d9f0eb] font-semibold text-[#168f83]">
									{phoneNumber.slice(-2)}
								</span>
								<span>
									<span className="block text-sm font-semibold text-[#26343c]">
										+{phoneNumber}
									</span>
									<span className="mt-1 block max-w-55 truncate text-xs text-[#87959d]">
										{lastMessage}
									</span>
								</span>
							</button>
						)
					})
				) : (
					<div className="px-6 py-10 text-center text-sm text-[#9aa6ad]">
						Нет чатов
					</div>
				)}
			</div>
			<button
				className="border-t border-[#e2e8eb] px-4 py-3 text-left text-sm text-[#697982] hover:bg-[#f6f8f9]"
				onClick={onDisconnect}
			>
				Выйти
			</button>
		</aside>
	)
}
