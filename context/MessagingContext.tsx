"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";

import { UserPublic } from "@/types/user";
import { Host } from "@/types/property";
import { Message, Thread, MessagingContextType } from "@/types/message";
import { useAuthContext } from "./AuthContext";

import {
  getThreads as apiGetThreads,
  getMessages as apiGetMessages,
  startConversation,
  sendMessage as apiSendMessage,
} from "@/lib/messaging";

const MessagingContext = createContext<MessagingContextType | null>(null);

/**
 * MessagingProvider component that manages conversation state.
 * Loads threads on authentication, provides methods to fetch/send messages.
 * Handles unread count calculation and message caching.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {React.ReactElement} Provider wrapping child components with messaging context.
 */
export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuthContext();
  const pathname = usePathname();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [threadsError, setThreadsError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  /* -------------------------------------------------------
     1) LOAD CONVERSATION THREADS
     Loads all conversation threads when the authenticated user changes.
     Skips messaging on login page and waits for auth to resolve.
  -------------------------------------------------------- */
  useEffect(() => {
    // Skip messaging requests on the login page.
    if (pathname === "/login") return;

    // Wait until the authentication state has been resolved.
    if (authLoading) return;

    // Clear private messaging data when no user is signed in.
    if (!user) {
      queueMicrotask(() => {
        setThreads([]);
        setThreadsLoading(false);
        setThreadsError(null);
        setMessages([]);
      });
      return;
    }

    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setThreadsLoading(true);
      setThreadsError(null);

      try {
        const data = await apiGetThreads(user);
        if (!cancelled) setThreads(data);
      } catch (err) {
        console.error("Failed to load threads:", err);
        if (!cancelled) {
          setThreads([]);
          setThreadsError(err instanceof Error ? err.message : "Impossible de charger les conversations.");
        }
      } finally {
        if (!cancelled) setThreadsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, pathname]);

    /* -------------------------------------------------------
      2) LOAD MESSAGES FOR THREAD
      Fetches messages for a specific thread and caches them.
      Replaces any previously cached messages for that thread.
    -------------------------------------------------------- */
  const loadMessagesForThread = useCallback(
    async (threadId: string): Promise<void> => {
      // Skip messaging requests on the login page.
      if (pathname === "/login") return;

      if (!user) return;

      try {
        const data = await apiGetMessages(threadId);

        queueMicrotask(() => {
          setMessages((prev) => {
            // Remove cached messages for this thread and add fresh ones
            const filtered = prev.filter((m) => m.threadId !== threadId);
            return [...filtered, ...data];
          });
        });
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    },
    [user, pathname]
  );

    /* -------------------------------------------------------
      3) COUNT UNREAD THREADS
      Compares each thread's updatedAt timestamp with lastSeen timestamp in localStorage.
      A thread is considered unread if it was updated after lastSeen.
    -------------------------------------------------------- */
  const unreadCount = useMemo(() => {
    return threads.filter((t) => {
      const lastSeen = Number(localStorage.getItem(`lastSeen_${t.id}`) || 0);
      const lastMessageAt = new Date(t.updatedAt).getTime();
      return lastMessageAt > lastSeen;
    }).length;
  }, [threads]);

    /* -------------------------------------------------------
      4) GET CACHED MESSAGES FOR THREAD
      Returns all cached messages belonging to a specific thread.
    -------------------------------------------------------- */
  const getMessages = useCallback(
    (threadId: string) => messages.filter((m) => m.threadId === threadId),
    [messages]
  );

    /* -------------------------------------------------------
      5) GET OTHER PARTICIPANT IN THREAD
      Returns the other user in a thread (not the current user).
      Throws if the thread ID is not found.
    -------------------------------------------------------- */
  const getThreadUser = useCallback(
    (threadId: string): UserPublic | Host => {
      const thread = threads.find((t) => t.id === threadId);
      if (!thread) throw new Error("Thread not found");
      return thread.otherUser;
    },
    [threads]
  );

    /* -------------------------------------------------------
      6) START CONVERSATION WITH HOST
      Creates a new conversation thread or opens an existing one.
      Optimistically adds the thread to state, then syncs with backend.
      Fetches messages for the new thread.
    -------------------------------------------------------- */
  const startConversationWithHost = useCallback(
    async (
      host: UserPublic | Host,
      propertyId: string,
      suggestedMessage?: string
    ): Promise<string | undefined> => {
      
      // Do not start a conversation from the login page.
      if (pathname === "/login") return;

      if (!user) return;

      try {
        // Create the conversation and get the thread ID
        const { threadId } = await startConversation(
          propertyId,
          String(host.id),
          suggestedMessage ?? ""
        );

        // Optimistically add the new thread to state with the host data we already have
        const newThread: Thread = {
          id: threadId,
          otherUser: host,
          lastMessage: suggestedMessage ?? "",
          updatedAt: new Date().toISOString(),
        };
        setThreads((previous) => [
          ...previous.filter((thread) => thread.id !== threadId),
          newThread,
        ]);

        try {
          // Refresh threads from backend to get the most up-to-date data
          const updatedThreads = await apiGetThreads(user);
          // Merge backend threads with our new thread, preserving the host data we already have
          setThreads((current) => {
            const merged = new Map(
              current.map((t) => [t.id, t])
            );
            updatedThreads.forEach((t) => {
              // Only update from backend if we don't have otherUser data yet
              if (!merged.has(t.id) || !merged.get(t.id)!.otherUser?.name) {
                merged.set(t.id, t);
              }
            });
            return Array.from(merged.values());
          });
        } catch (refreshError) {
          console.error("Failed to refresh threads after starting a conversation:", refreshError);
        }

        // Fetch messages for the new thread
        await loadMessagesForThread(threadId);

        return threadId;
      } catch (err) {
        console.error("Failed to start conversation:", err);
        throw err;
      }
    },
    [user, loadMessagesForThread, pathname]
  );

    /* -------------------------------------------------------
      7) SEND MESSAGE TO THREAD
      Sends a message to a conversation thread.
      Refreshes thread and message data after sending.
    -------------------------------------------------------- */
  const sendMessage = useCallback(
    async (threadId: string, content: string): Promise<void> => {
      // Do not send messages from the login page.
      if (pathname === "/login") return;

      if (!user) return;

      try {
        await apiSendMessage(threadId, content);

        // Refresh messages to include the newly sent message
        await loadMessagesForThread(threadId);

        // Refresh threads to update lastMessage timestamp
        const updatedThreads = await apiGetThreads(user);
        queueMicrotask(() => setThreads(updatedThreads));
      } catch (err) {
        console.error("Failed to send message:", err);
        throw err;
      }
    },
    [user, loadMessagesForThread, pathname]
  );

    /* -------------------------------------------------------
      8) CONTEXT VALUE
      Provides safe defaults when signed out and live data when signed in.
      Memoized to prevent unnecessary re-renders.
    -------------------------------------------------------- */
  const value = useMemo<MessagingContextType>(() => {
    if (!user) {
      return {
        currentUser: null,
        threads: [],
        threadsLoading,
        threadsError,
        messages: [],
        unreadCount: 0,
        getMessages: () => [],
        sendMessage: async () => {},
        getThreadUser: () => {
          throw new Error("Not logged in");
        },
        startConversationWithHost: async () => undefined,
        loadMessagesForThread: async () => {},
      };
    }

    return {
      currentUser: user,
      threads,
      threadsLoading,
      threadsError,
      messages,
      unreadCount,
      getMessages,
      sendMessage,
      getThreadUser,
      startConversationWithHost,
      loadMessagesForThread,
    };
  }, [
    user,
    threads,
    threadsLoading,
    threadsError,
    messages,
    unreadCount,
    getMessages,
    sendMessage,
    getThreadUser,
    startConversationWithHost,
    loadMessagesForThread,
  ]);

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
}

/**
 * Hook to access the messaging context.
 *
 * @returns {MessagingContextType} The messaging context value.
 * @throws {Error} If used outside MessagingProvider.
 */
export function useMessaging() {
  const ctx = useContext(MessagingContext);
  if (!ctx)
    throw new Error("useMessaging must be used inside MessagingProvider");
  return ctx;
}