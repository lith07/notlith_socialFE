export type MessageInput = { author: string; text: string; createdAt: string }
export type Message = MessageInput & { id: number }
