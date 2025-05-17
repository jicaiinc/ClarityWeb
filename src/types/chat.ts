
// 消息状态
export enum MessageStatus {
  PENDING = 'pending',
  SENDING = 'sending',
  SENT = 'sent',
  ERROR = 'error'
}


// 聊天上下文接口
export interface ChatContext {
  conversationId?: string
  parentMessageId?: string
  model?: string
}



export interface SelectOption {
  value: string
  label: string
}
