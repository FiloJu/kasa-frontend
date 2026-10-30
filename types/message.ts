import { UserPublic } from "./user";
import { Host } from "./property";
import { AuthUser } from "./auth";

/** A message exchanged between the participants of a conversation thread. */
export interface Message {
  id: string;
  threadId: string;
  sender: UserPublic | Host;
  content: string;
  createdAt: string;
  read: boolean;
}

/** A conversation summary shown in the messaging interface. */
export interface Thread {
  id: string;
  otherUser: UserPublic | Host;
  lastMessage: string;
  updatedAt: string;
}

/** State and actions exposed by the messaging context. */
export interface MessagingContextType {
  currentUser: AuthUser | null;
  threads: Thread[];
  threadsLoading: boolean;
  threadsError: string | null;
  messages: Message[];
  unreadCount: number;
  getMessages: (threadId: string) => Message[];
  sendMessage: (threadId: string, content: string) => Promise<void>;
  getThreadUser: (threadId: string) => UserPublic | Host;
  startConversationWithHost: (
    host: UserPublic | Host,
    propertyId: string,
    suggestedMessage?: string
  ) => Promise<string | undefined>;
  loadMessagesForThread: (threadId: string) => Promise<void>;
}