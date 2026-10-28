import { apiFetch } from "@/lib/api";
import { Thread, Message } from "@/types/message";

/**
 * Initiates a conversation with another user.
 * Creates a new thread or selects an existing one if it already exists.
 * The backend authenticates the request using the current session.
 *
 * @async
 * @function startConversation
 * @param {string} propertyId - ID of the property being discussed.
 * @param {string} otherUserId - ID of the other participant (e.g., property host).
 * @param {string} content - Initial message to send in the conversation.
 * @returns {Promise<{ threadId: string }>} The ID of the created or selected thread.
 * @throws {Error} If the request fails or the user is unauthenticated.
 */
export async function startConversation(
  propertyId: string,
  otherUserId: string,
  content: string
): Promise<{ threadId: string }> {
  const payload = { propertyId, otherUserId, content };
  return apiFetch("/api/messaging/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Fetches all conversation threads belonging to the authenticated user.
 * Transforms backend thread format to frontend format, mapping participant data.
 * The backend rejects the request if the user is unauthenticated.
 *
 * @async
 * @function getThreads
 * @param {any} currentUser - Current authenticated user object to determine otherUser.
 * @returns {Promise<Thread[]>} The user's conversation threads.
 * @throws {Error} If the request fails or the user is unauthenticated.
 */
export async function getThreads(currentUser?: any): Promise<Thread[]> {
  const rawThreads = await apiFetch<any[]>("/api/messaging/threads");
  
  // Transform backend threads to frontend format
  const transformed = rawThreads.map((thread, index) => {
    // Determine who is the other user based on current user ID and participants
    let otherUser: any = { id: 'unknown', name: 'Utilisateur', picture: null };
    
    if (thread.participants) {
      const { client, owner } = thread.participants;
      const currentUserId = currentUser?.id;
      
      // Logic: if current user is client, other user is owner; if current user is owner, other user is client
      if (currentUserId === client?.id) {
        otherUser = owner || { id: 'unknown', name: 'Utilisateur', picture: null };
      } else if (currentUserId === owner?.id) {
        otherUser = client || { id: 'unknown', name: 'Utilisateur', picture: null };
      } else {
        // Fallback: use owner if we can't determine the relationship
        otherUser = owner || client || { id: 'unknown', name: 'Utilisateur', picture: null };
      }
    }
    
    // Parse lastMessage - backend may return string or object
    const lastMessageText = thread.lastMessage 
      ? (typeof thread.lastMessage === 'string' ? thread.lastMessage : thread.lastMessage.body || thread.lastMessage.content || '')
      : '';
    
    return {
      id: thread.id || `thread-${index}`,
      otherUser,
      lastMessage: lastMessageText,
      updatedAt: thread.updatedAt || new Date().toISOString(),
    };
  });
  
  return transformed;
}

/**
 * Fetches all messages in a conversation thread.
 * Transforms backend message format to frontend format, including date parsing and sender mapping.
 * The backend authenticates the request using the current session.
 *
 * @async
 * @function getMessages
 * @param {string} threadId - ID of the thread whose messages should be fetched.
 * @returns {Promise<Message[]>} The messages in the requested thread.
 * @throws {Error} If the request fails or the thread cannot be accessed.
 */
export async function getMessages(threadId: string): Promise<Message[]> {
  const rawMessages = await apiFetch<any[]>(
    `/api/messaging/threads/${threadId}/messages`
  );
  
  // Transform backend messages to frontend format
  const transformed = rawMessages.map((msg, index) => {
    // Parse created_at which may come in format "2026-10-28 07:32:24" or ISO format
    let createdAt = new Date().toISOString();
    if (msg.created_at || msg.createdAt) {
      const dateStr = msg.created_at || msg.createdAt;
      // Handle both formats: "2026-10-28 07:32:24" and ISO format
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        createdAt = parsed.toISOString();
      }
    }
    
    // Map snake_case backend fields to camelCase frontend fields
    return {
      id: msg.id || `msg-${index}-${Date.now()}`,
      threadId,
      sender: {
        id: msg.sender_id || msg.senderId || 'unknown',
        name: msg.sender_name || msg.senderName || 'Utilisateur',
        picture: msg.sender_picture || msg.senderPicture || null,
      },
      content: msg.content || msg.body || '',
      createdAt,
      read: msg.read ?? false,
    };
  });
  
  return transformed;
}

/**
 * Sends a message in an existing conversation thread.
 * The backend rejects the request if the user is unauthenticated or not a thread participant.
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}