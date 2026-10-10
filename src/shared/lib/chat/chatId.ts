export function createChatId(phoneNumber: string) {
	const digits = phoneNumber.replace(/\D/g, '')
	return digits
}

export function getPhoneNumber(chatId: string) {
	return chatId
}

export function getComparableChatId(chatId: string) {
	return chatId.replace(/\D/g, '')
}
