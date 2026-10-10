import type { ChatMessage } from '../../../entities/message'
import { MessageComposer } from '../../../features/send-message'
import { getPhoneNumber } from '../../../shared/lib/chat/chatId'

type ChatWindow = {
	chatId: string | null
	messages: ChatMessage[]
	error: string
	onNewChat: () => void
	onSendMessage: (text: string) => Promise<void>
}

export function ChatWindow({
	chatId,
	messages,
	error,
	onNewChat,
	onSendMessage
}: ChatWindow) {
	if (!chatId)
		return (
			<section className="relative hidden flex-1 flex-col items-center justify-center bg-[#eef3f5] md:flex">
				<button
					onClick={onNewChat}
					className="rounded-lg bg-[#168f83] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#11766d]"
				>
					Новый чат
				</button>
			</section>
		)

	return (
		<section className="relative hidden flex-1 flex-col bg-[#eef3f5] md:flex">
			<header className="flex h-[62px] items-center border-b border-[#dce5e9] bg-white px-6">
				<span className="grid size-10 place-items-center rounded-full bg-[#d9f0eb] text-sm font-semibold text-[#168f83]">
					{getPhoneNumber(chatId).slice(-2)}
				</span>
				<span className="ml-3 text-sm font-semibold text-[#26343c]">
					+{getPhoneNumber(chatId)}
				</span>
			</header>
			<div className="flex-1 space-y-2 overflow-y-auto p-6">
				{messages.map(message => (
					<div
						key={message.id}
						className={`flex ${message.direction === 'incoming' ? 'justify-start' : 'justify-end'}`}
					>
						<div
							className={`max-w-[min(70%,520px)] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.direction === 'incoming' ? 'bg-white text-[#26343c]' : 'bg-[#d8f3e8] text-[#26343c]'}`}
						>
							<p>{message.text}</p>
							<span className="mt-1 block text-right text-[10px] text-[#829198]">
								{message.time}
							</span>
						</div>
					</div>
				))}
			</div>
			<MessageComposer
				error={error}
				onSend={onSendMessage}
			/>
		</section>
	)
}
