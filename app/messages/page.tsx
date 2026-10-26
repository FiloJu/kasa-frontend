"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";
import { useMessaging } from "@/context/MessagingContext";

export default function MessagesPage() {
	const router = useRouter();
	const { user, loading: authLoading } = useAuthContext();
	const {
		threads,
		threadsLoading,
		threadsError,
		unreadCount,
		getMessages,
		getThreadUser,
		loadMessagesForThread,
		sendMessage,
	} = useMessaging();
	const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
	const [draft, setDraft] = useState("");
	const [sending, setSending] = useState(false);
	const [sendError, setSendError] = useState("");

	useEffect(() => {
		const threadId = new URLSearchParams(window.location.search).get("threadId");
		if (threadId) {
			queueMicrotask(() => setSelectedThreadId(threadId));
		}
	}, []);

	useEffect(() => {
		if (!authLoading && !user) {
			router.replace("/login?returnTo=%2Fmessages");
		}
	}, [authLoading, user, router]);

	useEffect(() => {
		if (selectedThreadId) {
			void loadMessagesForThread(selectedThreadId);
		}
	}, [selectedThreadId, loadMessagesForThread]);

	if (authLoading || !user) return null;

	const selectedThread = threads.find((thread) => thread.id === selectedThreadId);
	const selectedUser = selectedThreadId
		? (() => {
				try {
					return getThreadUser(selectedThreadId);
				} catch {
					return null;
				}
			})()
		: null;
	const selectedMessages = selectedThreadId ? getMessages(selectedThreadId) : [];

	async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!selectedThreadId || !draft.trim() || sending) return;

		setSending(true);
		setSendError("");
		try {
			await sendMessage(selectedThreadId, draft.trim());
			setDraft("");
		} catch (error) {
			setSendError(error instanceof Error ? error.message : "Impossible d’envoyer le message.");
		} finally {
			setSending(false);
		}
	}

	return (
		<article className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-8 md:py-8">
			<header className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold text-black md:text-[32px]">Messages</h1>
					<p className="mt-1 text-sm text-gray-dark">
						{threads.length} conversation{threads.length === 1 ? "" : "s"}
						{unreadCount > 0 ? ` · ${unreadCount} non lue${unreadCount === 1 ? "" : "s"}` : ""}
					</p>
				</div>
			</header>

			<div className="grid min-h-[560px] flex-1 overflow-hidden rounded-[10px] border border-gray-light bg-white md:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
				<section
					aria-label="Liste des conversations"
					className={`flex flex-col border-gray-light md:border-r ${selectedThreadId ? "hidden md:flex" : "flex"}`}
				>
					<h2 className="border-b border-gray-light px-5 py-4 text-sm font-semibold text-black">
						Vos conversations
					</h2>

					{threadsLoading ? (
						<p className="px-5 py-6 text-sm text-gray-dark" role="status">
							Chargement des conversations…
						</p>
					) : threadsError ? (
						<p className="px-5 py-6 text-sm text-red-700" role="alert">
							Impossible de charger les conversations : {threadsError}
						</p>
					) : threads.length === 0 ? (
						<p className="px-5 py-6 text-sm leading-relaxed text-gray-dark">
							Aucune conversation pour le moment.
						</p>
					) : (
						<ul className="flex flex-col">
							{threads.map((thread) => (
								<li key={thread.id}>
									<button
										type="button"
										onClick={() => {
											setDraft("");
											setSendError("");
											setSelectedThreadId(thread.id);
										}}
										aria-current={thread.id === selectedThreadId ? "true" : undefined}
										className={`flex w-full flex-col gap-1 border-b border-gray-light px-5 py-4 text-left transition-colors hover:bg-[#FFFBF9] ${thread.id === selectedThreadId ? "bg-[#FFFBF9]" : "bg-white"}`}
									>
										<span className="text-sm font-medium text-black">
											{thread.otherUser.name}
										</span>
										<span className="line-clamp-2 text-xs text-gray-dark">
											{thread.lastMessage || "Ouvrir la conversation"}
										</span>
									</button>
								</li>
							))}
						</ul>
					)}
				</section>

				<section
					aria-label="Conversation sélectionnée"
					className={`min-w-0 flex-col ${selectedThreadId ? "flex" : "hidden md:flex"}`}
				>
					{selectedThreadId && selectedThread && selectedUser ? (
						<>
							<div className="flex items-center gap-3 border-b border-gray-light px-5 py-4">
								<button
									type="button"
									onClick={() => setSelectedThreadId(null)}
									className="rounded-full px-2 py-1 text-sm text-gray-dark hover:bg-gray-100 md:hidden"
								>
									Retour
								</button>
								<h2 className="text-sm font-semibold text-black">{selectedUser.name}</h2>
							</div>

							<div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
								{selectedMessages.length > 0 ? (
									selectedMessages.map((message) => (
										<div
											key={message.id}
											className={`max-w-[85%] rounded-[10px] px-4 py-3 text-sm text-black ${String(message.sender.id) === String(user.id) ? "self-end bg-[#FFFBF9]" : "self-start bg-gray-100"}`}
										>
											<p>{message.content}</p>
											<time className="mt-2 block text-[11px] text-gray-dark">
												{new Date(message.createdAt).toLocaleString("fr-FR")}
											</time>
										</div>
									))
								) : (
									<p className="m-auto text-center text-sm text-gray-dark">
										Commencez la conversation en envoyant un message.
									</p>
								)}
							</div>
							<form onSubmit={handleSendMessage} className="border-t border-gray-light p-4">
								{sendError && <p className="mb-2 text-sm text-red-700" role="alert">{sendError}</p>}
								<div className="flex items-end gap-3">
									<label htmlFor="message-draft" className="sr-only">Votre message</label>
									<textarea
										id="message-draft"
										value={draft}
										onChange={(event) => setDraft(event.target.value)}
										placeholder="Écrivez votre message…"
										rows={2}
										className="min-h-11 flex-1 resize-y rounded-[8px] border border-gray-light px-3 py-2 text-sm outline-none focus:border-[#99331A]"
									/>
									<button
										type="submit"
										disabled={!draft.trim() || sending}
										className="h-11 shrink-0 rounded-[10px] bg-[#99331A] px-5 text-sm font-medium text-white hover:bg-[#7D2915] disabled:cursor-not-allowed disabled:opacity-50"
									>
										{sending ? "Envoi…" : "Envoyer"}
									</button>
								</div>
							</form>
						</>
					) : (
						<div className="hidden flex-1 items-center justify-center p-8 text-center text-sm text-gray-dark md:flex">
							Sélectionnez une conversation
						</div>
					)}
				</section>
			</div>
		</article>
	);
}
