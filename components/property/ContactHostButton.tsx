"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";
import { useMessaging } from "@/context/MessagingContext";
import type { Host } from "@/types/property";

export default function ContactHostButton({
  host,
  propertyId,
}: {
  host: Host;
  propertyId: string;
}) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { startConversationWithHost } = useMessaging();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleContact() {
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(`/properties/${propertyId}`)}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const threadId = await startConversationWithHost(host, propertyId);
      if (!threadId) {
        setError("Impossible de démarrer la conversation. Réessayez.");
        return;
      }
      router.push(`/messages?threadId=${encodeURIComponent(threadId)}`);
    } catch (contactError) {
      setError(
        contactError instanceof Error
          ? contactError.message
          : "Impossible de démarrer la conversation. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <button
        type="button"
        onClick={handleContact}
        disabled={loading}
        className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#99331A] px-4 text-sm font-medium text-white transition-colors hover:bg-[#7D2915] disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Ouverture de la conversation…" : "Envoyer un message"}
      </button>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
    </div>
  );
}
