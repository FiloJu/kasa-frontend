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

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuthContext();
  const pathname = usePathname();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [threadsError, setThreadsError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  /* -------------------------------------------------------
     1) Load conversation threads when the authenticated user changes.
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
        const data = await apiGetThreads();
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
      2) Load a thread's messages and replace any cached messages for it.
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
      3) Count threads updated since their last-seen timestamp in local storage.
    -------------------------------------------------------- */
  const unreadCount = useMemo(() => {
    return threads.filter((t) => {
      const lastSeen = Number(localStorage.getItem(`lastSeen_${t.id}`) || 0);
      const lastMessageAt = new Date(t.updatedAt).getTime();
      return lastMessageAt > lastSeen;
    }).length;
  }, [threads]);

    /* -------------------------------------------------------
      4) Return the messages currently cached for a thread.
    -------------------------------------------------------- */
  const getMessages = useCallback(
    (threadId: string) => messages.filter((m) => m.threadId === threadId),
    [messages]
  );

    /* -------------------------------------------------------
      5) Return the other participant in a thread, or throw if it is not loaded.
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
      6) Start a conversation, then refresh its thread and message data.
    -------------------------------------------------------- */
  const startConversationWithHost = useCallback(
    async (
      host: UserPublic | Host,
      propertyId: string,
      suggestedMessage?: string
    ): Promise<string | undefined> => {
      console.log("startConversationWithHost called with:", { propertyId, hostId: host.id, suggestedMessage });
      
      // Do not start a conversation from the login page.
      if (pathname === "/login") return;

      if (!user) return;

      try {
        const { threadId } = await startConversation(
          propertyId,
          String(host.id),
          suggestedMessage ?? ""
        );

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
          const updatedThreads = await apiGetThreads();
          if (updatedThreads.some((thread) => thread.id === threadId)) {
            setThreads(updatedThreads);
          }
        } catch (refreshError) {
          console.error("Failed to refresh threads after starting a conversation:", refreshError);
        }

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
      7) Send a message, then refresh the thread and its messages.
    -------------------------------------------------------- */
  const sendMessage = useCallback(
    async (threadId: string, content: string): Promise<void> => {
      // Do not send messages from the login page.
      if (pathname === "/login") return;

      if (!user) return;

      try {
        await apiSendMessage(threadId, content);

        await loadMessagesForThread(threadId);

        const updatedThreads = await apiGetThreads();
        queueMicrotask(() => setThreads(updatedThreads));
      } catch (err) {
        console.error("Failed to send message:", err);
        throw err;
      }
    },
    [user, loadMessagesForThread, pathname]
  );

    /* -------------------------------------------------------
      8) Expose empty safe defaults when signed out and live data when signed in.
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

export function useMessaging() {
  const ctx = useContext(MessagingContext);
  if (!ctx)
    throw new Error("useMessaging must be used inside MessagingProvider");
  return ctx;
}