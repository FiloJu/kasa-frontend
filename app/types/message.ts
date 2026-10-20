import { UserPublic } from "./user";
import { Host } from "./property";
import { AuthUser } from "./auth";

/** A single message exchanged between the two participants in a thread. */
export interface Message {
  /** Unique identifier assigned to the message. */
  id: string;
  /** Identifier of the conversation thread containing this message. */
  threadId: string;
  /** User or host who sent the message. */
  sender: UserPublic | Host;
  /** Text content displayed in the conversation. */
  content: string;
  /** ISO date-time when the message was created. */
  createdAt: string;
  /** Whether the message has been marked as read. */
  read: boolean;
}

/** Conversation summary used to populate the messaging thread list. */
export interface Thread {
  /** Unique identifier used to load and send messages in this thread. */
  id: string;
  /** Other participant in the conversation from the current user's perspective. */
  otherUser: UserPublic | Host;
  /** Text of the most recent message in the thread. */
  lastMessage: string;
  /** ISO date-time of the most recent thread activity. */
  updatedAt: string;
}

/** Data and actions exposed by the messaging provider to consuming components. */
export interface MessagingContextType {
  /** Currently authenticated participant, or null when signed out. */
  currentUser: AuthUser | null;
  /** Conversation summaries available to the current user. */
  threads: Thread[];
  /** Messages currently loaded by the provider. */
  messages: Message[];
  /** Number of threads with activity newer than their locally stored last-seen time. */
  unreadCount: number;
  /** Return the messages currently loaded for a thread. */
  getMessages: (threadId: string) => Message[];
  /** Send a message to an existing thread and refresh its data. */
  sendMessage: (threadId: string, content: string) => Promise<void>;
  /** Return the other participant in a thread. */
  getThreadUser: (threadId: string) => UserPublic | Host;
  /** Start a thread with a host and optionally send an initial message. */
  startConversationWithHost: (
    host: UserPublic | Host,
    suggestedMessage?: string
  ) => Promise<string | undefined>;
  /** Load messages for a thread and update the provider's cached message list. */
  loadMessagesForThread: (threadId: string) => Promise<void>;
}