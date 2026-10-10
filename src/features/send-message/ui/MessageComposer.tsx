import { useState } from 'react'

type MessageComposer = {
	disabled?: boolean
	error?: string
	onSend: (text: string) => Promise<void>
}

export function MessageComposer({ disabled, error, onSend }: MessageComposer) {
	const [text, setText] = useState('')

	async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
		evt.preventDefault()

		const message = text.trim()
		if (!message) return
		await onSend(message)
		setText('')
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="border-t border-[#dce5e9] bg-white p-4"
		>
			<div className="mx-auto flex max-w-3xl gap-3">
				<input
					value={text}
					onChange={evt => setText(evt.target.value)}
					disabled={disabled}
					className="min-w-0 flex-1 rounded-xl bg-[#f1f3f5] px-4 py-3 text-sm outline-none"
					placeholder="Сообщение"
				/>
				<button
					type="submit"
					disabled={disabled}
					className="rounded-xl bg-[#168f83] px-5 text-sm font-semibold text-white hover:bg-[#11766d] disabled:cursor-not-allowed disabled:opacity-50"
				>
					Отправить
				</button>
			</div>
			{error && (
				<p className="mx-auto mt-2 max-w-3xl text-xs text-red-600">{error}</p>
			)}
		</form>
	)
}
