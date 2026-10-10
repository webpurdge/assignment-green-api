import type { GreenApiNotification } from '../../api/greenApi'

type NotificationBody = Record<string, unknown>

export type IncomingMessage = { chatId: string; text: string }

export function readIncomingMessage(
	notification: GreenApiNotification<NotificationBody>
): IncomingMessage | null {
	const messageData = notification.body.messageData as
		| NotificationBody
		| undefined
	const textData = messageData?.textMessageData as NotificationBody | undefined
	const senderData = notification.body.senderData as
		| NotificationBody
		| undefined
	const extendedText = messageData?.extendedTextMessageData as
		| NotificationBody
		| undefined
	const text = String(
		textData?.textMessage ??
			messageData?.textMessage ??
			extendedText?.text ??
			''
	)
	const chatId = String(senderData?.chatId ?? senderData?.sender ?? '')

	if (!text || !chatId) return null
	return { chatId, text }
}
