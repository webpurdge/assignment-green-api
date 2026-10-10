export type ChatMessage = {
	id: string
	text: string
	direction: 'incoming' | 'outgoing'
	time: string
}

export type Chat = {
	id: string
	messages: ChatMessage[]
}
