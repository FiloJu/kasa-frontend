"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login, error: backendError } = useAuthContext();

  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setLocalError(null);

    const form = e.target as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    try {
      await login(email, password);
      const returnTo = new URLSearchParams(window.location.search).get("returnTo");
      const destination = returnTo?.startsWith("/") && !returnTo.startsWith("//")
        ? returnTo
        : "/";
      router.replace(destination);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message);
      } else {
        setLocalError("Erreur inconnue");
      }
      setSubmitting(false);
    }

  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 w-full max-w-81.5 md:max-w-90 flex flex-col gap-6"
    >
      {(localError || backendError) && (
        <p className="text-red-600 text-[14px] font-medium text-center">
          {localError || backendError}
        </p>
      )}

      <div className="flex flex-col items-start">
        <label htmlFor="email" className="text-[14px] font-medium text-black mb-1">
          Adresse email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full h-10 border border-gray-light rounded-lg px-3 text-[14px]"
          required
        />
      </div>

      <div className="flex flex-col items-start">
        <label htmlFor="password" className="text-[14px] font-medium text-black mb-1">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full h-10 border border-gray-light rounded-lg px-3 text-[14px]"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-57.5 h-9 bg-main-red text-white text-[14px] font-medium rounded-10 mx-auto mt-2 hover:bg-dark-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Connexion..." : "Se connecter"}
      </button>

      <div className="flex flex-col">
        <Link
          href="/forgot-password"
          className="text-[14px] text-main-red hover:text-dark-orange transition-colors"
        >
          Mot de passe oublié
        </Link>

        <p className="mt-3 text-[14px] text-main-red font-normal mx-auto">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-main-red font-normal hover:text-dark-orange transition-colors">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </form>
  );
}