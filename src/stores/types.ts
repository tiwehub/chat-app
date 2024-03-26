export interface User {
  id: string
  name: string
  username: string
  avatar: string
}

export interface Message {
  senderId: string
  receiverId: string
  text: string
  timestamp: string
}
