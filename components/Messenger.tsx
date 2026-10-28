'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { useMessaging } from '@/context/MessagingContext';
import { getPropertyById } from '@/lib/properties';

export default function Messenger() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  
  const { user, loading: authLoading } = useAuthContext();
  const { 
    threads, 
    startConversationWithHost, 
    loadMessagesForThread, 
    getMessages,
    getThreadUser,
    sendMessage: sendThreadMessage,
  } = useMessaging();

  const [authChecked, setAuthChecked] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [showList, setShowList] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Check authentication
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        const target = propertyId ? `/messages?propertyId=${propertyId}` : '/messages';
        router.replace(`/login?returnTo=${encodeURIComponent(target)}`);
      } else {
        setAuthChecked(true);
      }
    }
  }, [authLoading, user, router, propertyId]);

  // Handle propertyId param: start/open conversation with that property's host
  useEffect(() => {
    if (!propertyId || !authChecked || !user) return;

    setLoading(true);
    setError('');

    async function initializeConversation() {
      if (!propertyId) return; // TypeScript guard
      
      try {
        const property = await getPropertyById(propertyId);
        if (!property) {
          setError('Propriété non trouvée');
          setLoading(false);
          return;
        }

        const threadId = await startConversationWithHost(property.host, propertyId);
        if (threadId) {
          setSelectedThreadId(threadId);
          await loadMessagesForThread(threadId);
          setShowList(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du démarrage de la conversation');
      } finally {
        setLoading(false);
      }
    }

    void initializeConversation();
  }, [propertyId, authChecked, user, startConversationWithHost, loadMessagesForThread]);

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThreadId, getMessages]);

  if (!authChecked) return null;

  const selectedThread = selectedThreadId ? threads.find(t => t.id === selectedThreadId) : null;
  const selectedMessages = selectedThreadId ? getMessages(selectedThreadId) : [];
  
  // Debug log to see actual message structure
  if (selectedMessages.length > 0) {
    console.log('Messenger selectedMessages:', selectedMessages);
  }
  
  let selectedUser = null;
  try {
    selectedUser = selectedThreadId ? getThreadUser(selectedThreadId) : null;
  } catch {
    selectedUser = null;
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedThreadId || !draft.trim()) return;

    try {
      await sendThreadMessage(selectedThreadId, draft.trim());
      setDraft('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    }
  }

  function openConversation(threadId: string) {
    setSelectedThreadId(threadId);
    setShowList(false);
    void loadMessagesForThread(threadId);
  }

  const sortedThreads = [...threads].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className="px-4 md:px-8 pt-6 md:pt-10 pb-10 max-w-6xl mx-auto">
      <h1 className="text-[32px] font-bold text-main-red text-center mb-8">Messages</h1>

      <div className="bg-white rounded-[10px] border border-gray-light flex h-[70vh] min-h-[420px] overflow-hidden">
        {/* Liste des conversations */}
        <aside className={`w-full md:w-[320px] shrink-0 border-r border-gray-light overflow-y-auto ${showList ? 'block' : 'hidden'} md:block`}>
          <div className="border-b border-gray-light px-5 py-4">
            <h2 className="text-sm font-semibold text-black">Vos conversations</h2>
          </div>
          
          {sortedThreads.length === 0 ? (
            <p className="text-sm text-gray-dark p-6">
              Vous n'avez pas encore de conversation. Contactez un hôte depuis une annonce pour démarrer une discussion.
            </p>
          ) : (
            <ul className="flex flex-col">
              {sortedThreads.map(thread => (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => openConversation(thread.id)}
                    className={`w-full flex flex-col gap-1 border-b border-gray-light px-5 py-4 text-left transition-colors hover:bg-[#FFFBF9] ${thread.id === selectedThreadId ? 'bg-[#FFFBF9]' : ''}`}
                  >
                    <span className="text-sm font-medium text-black">
                      {thread.otherUser?.name ?? 'Utilisateur'}
                    </span>
                    <span className="text-xs text-gray-dark truncate">
                      {String(thread.lastMessage || 'Ouvrir la conversation')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Fil de discussion */}
        <div className={`flex-1 flex-col ${showList ? 'hidden' : 'flex'} md:flex`}>
          {selectedThread && selectedUser ? (
            <>
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-light">
                <button
                  type="button"
                  onClick={() => setShowList(true)}
                  className="md:hidden text-gray-dark hover:text-black"
                  aria-label="Retour"
                >
                  ←
                </button>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-black truncate">
                    {selectedUser.name ?? 'Utilisateur'}
                  </h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {error && (
                  <p className="text-center text-sm text-red-700">{error}</p>
                )}
                {loading ? (
                  <p className="text-center text-sm text-gray-dark">Chargement…</p>
                ) : selectedMessages.length > 0 ? (
                  selectedMessages.map(message => {
                    // Ensure message has required fields
                    if (!message || typeof message !== 'object') return null;
                    
                    const content = String(message.content || '(message vide)');
                    const senderId = String(message.sender?.id || '');
                    const userId = String(user?.id || '');
                    
                    return (
                      <div
                        key={message.id}
                        className={`max-w-[75%] px-4 py-2 rounded-[10px] text-sm ${
                          senderId === userId
                            ? 'self-end bg-main-red text-white'
                            : 'self-start bg-gray-100 text-black'
                        }`}
                      >
                        <p>{content}</p>
                        <time className="block text-xs opacity-70 mt-1">
                          {new Date(message.createdAt).toLocaleString('fr-FR')}
                        </time>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-sm text-gray-dark">
                    Commencez la conversation en envoyant un message.
                  </p>
                )}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleSend} className="flex items-end gap-3 px-5 py-4 border-t border-gray-light">
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="Écrivez votre message…"
                  rows={2}
                  className="flex-1 border border-gray-light rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-main-red"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="shrink-0 h-11 px-4 rounded-[10px] bg-main-red text-white text-sm font-medium hover:bg-dark-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Envoyer
                </button>
              </form>
            </>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-dark text-sm text-center px-6">
              Sélectionnez une conversation pour afficher les messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
