import { UserPublic } from "./user";
import { Host } from "./property";
import { AuthUser } from "./auth";

export interface Message {
  id: string;
  threadId: string;
  sender: UserPublic | Host;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Thread {
  id: string;
  otherUser: UserPublic | Host;
  lastMessage: string;
  updatedAt: string;
}

export interface MessagingContextType {
  currentUser: AuthUser | null;
  threads: Thread[];
  messages: Message[];
  unreadCount: number;
  getMessages: (threadId: string) => Message[];
  sendMessage: (threadId: string, content: string) => Promise<void>;
  getThreadUser: (threadId: string) => UserPublic | Host;
  startConversationWithHost: (
    host: UserPublic | Host,
    suggestedMessage?: string
  ) => Promise<string | undefined>;
  loadMessagesForThread: (threadId: string) => Promise<void>;
}