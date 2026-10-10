import { useState } from 'react'
import type { GreenApiCredentials } from '../../../shared/api/greenApi'

type CredentialsForm = {
	onConnected: (credentials: GreenApiCredentials) => void
}

export function CredentialsForm({ onConnected }: CredentialsForm) {
	const [idInstance, setIdInstance] = useState('')
	const [apiTokenInstance, setApiTokenInstance] = useState('')

	return (
		<main className="grid min-h-screen place-items-center bg-[#f4f6f7] px-5">
			<form
				className="w-full max-w-md rounded-2xl border border-[#dfe6e9] bg-white p-6 shadow-sm"
				onSubmit={evt => {
					evt.preventDefault()

					if (idInstance && apiTokenInstance)
						onConnected({ idInstance, apiTokenInstance })
				}}
			>
				<h1 className="text-xl font-semibold text-[#182230]">Авторизация</h1>
				<p className="mt-2 text-sm text-[#71818b]">
					Введите учетные данные инстанса Telegram.
				</p>
				<label className="mt-6 block text-sm font-medium text-[#182230]">
					idInstance
					<input
						value={idInstance}
						onChange={evt => setIdInstance(evt.target.value)}
						className="mt-2 w-full rounded-lg border border-[#d9e2e6] px-3 py-2.5 text-sm outline-none focus:border-[#168f83]"
						placeholder="1101…"
						required
					/>
				</label>
				<label className="mt-4 block text-sm font-medium text-[#182230]">
					apiTokenInstance
					<input
						value={apiTokenInstance}
						onChange={evt => setApiTokenInstance(evt.target.value)}
						className="mt-2 w-full rounded-lg border border-[#d9e2e6] px-3 py-2.5 text-sm outline-none focus:border-[#168f83]"
						placeholder="Введите токен"
						type="password"
						required
					/>
				</label>
				<button
					className="mt-6 w-full rounded-lg bg-[#168f83] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#11766d]"
					type="submit"
				>
					Открыть мессенджер
				</button>
			</form>
		</main>
	)
}
