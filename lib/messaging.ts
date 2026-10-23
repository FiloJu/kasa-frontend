import { apiFetch } from "@/lib/api";
import { Thread, Message } from "@/types/message";

/**
 * Starts a conversation with another user, for example from a host card.
 * The backend authenticates the request using the HttpOnly session cookie.
 *
 * @async
 * @function startConversation
 * @param {string} otherUserId - ID of the other participant.
 * @param {string} content - Initial message to send in the conversation.
 * @returns {Promise<{ threadId: string }>} The ID of the created or selected thread.
 * @throws {Error} If the request fails, including when the user is unauthenticated.
 */
export async function startConversation(
  otherUserId: string,
  content: string
): Promise<{ threadId: string }> {
  return apiFetch("/api/messaging/start", {
    method: "POST",
    body: JSON.stringify({ otherUserId, content }),
  });
}

/**
 * Fetches all conversation threads belonging to the authenticated user.
 * The backend rejects the request if the user is unauthenticated.
 *
 * @async
 * @function getThreads
 * @returns {Promise<Thread[]>} The user's conversation threads.
 * @throws {Error} If the request fails, including when the user is unauthenticated.
 */
export async function getThreads(): Promise<Thread[]> {
  return apiFetch<Thread[]>("/api/messaging/threads");
}

/**
 * Fetches all messages in a conversation thread.
 * The backend authenticates the request using the current session.
 *
 * @async
 * @function getMessages
 * @param {string} threadId - ID of the thread whose messages should be fetched.
 * @returns {Promise<Message[]>} The messages in the requested thread.
 * @throws {Error} If the request fails or the thread cannot be accessed.
 */
export async function getMessages(threadId: string): Promise<Message[]> {
  return apiFetch<Message[]>(
    `/api/messaging/threads/${threadId}/messages`
  );
}

/**
 * Sends a message in an existing conversation thread.
 * The backend rejects the request if the user is unauthenticated.
 *
 * @async
 * @function sendMessage
 * @param {string} threadId - ID of the thread that will receive the message.
 * @param {string} content - Text content of the message.
 * @returns {Promise<{ ok: boolean }>} The API result indicating whether the send succeeded.
 * @throws {Error} If the request fails or the user is unauthenticated.
 */
export async function sendMessage(
  threadId: string,
  content: string
): Promise<{ ok: boolean }> {
  return apiFetch(`/api/messaging/threads/${threadId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}