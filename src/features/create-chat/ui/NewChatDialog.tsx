import { useState } from 'react'
import { createChatId } from '../../../shared/lib/chat/chatId'

type NewChatDialog = {
	onClose: () => void
	onChatCreated: (chatId: string) => void
}

export function NewChatDialog({ onClose, onChatCreated }: NewChatDialog) {
	const [phoneNumber, setPhoneNumber] = useState('')

	function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
		evt.preventDefault()

		const chatId = createChatId(phoneNumber)
		if (!chatId) return
		onChatCreated(chatId)
	}

	return (
		<div className="fixed inset-0 z-10 grid place-items-center bg-[#1d2b31]/30 p-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
			>
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-[#26343c]">Новый чат</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-2xl leading-none text-[#84919a]"
					>
						×
					</button>
				</div>
				<label className="mt-5 block text-sm font-medium text-[#26343c]">
					Номер телефона
					<input
						autoFocus
						value={phoneNumber}
						onChange={evt => setPhoneNumber(evt.target.value)}
						placeholder="79991234567"
						className="mt-2 w-full rounded-lg border border-[#d5dfe3] px-3 py-2.5 text-sm outline-none focus:border-[#168f83]"
					/>
				</label>
				<button
					type="submit"
					className="mt-5 w-full rounded-lg bg-[#168f83] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#11766d]"
				>
					Создать чат
				</button>
			</form>
		</div>
	)
}
