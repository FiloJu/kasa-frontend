"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";

/** Displays the signed-in user's account details. */
export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?returnTo=%2Fprofile");
    }
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
      <header>
        <h1 className="text-2xl font-semibold text-black md:text-3xl">Mon profil</h1>
        <p className="mt-2 text-sm text-gray-dark">Informations de votre compte Kasa.</p>
      </header>

      <section className="flex flex-col gap-5 rounded-[10px] border border-gray-light bg-white p-5 md:p-8" aria-label="Informations personnelles">
        <div>
          <h2 className="text-xs font-medium uppercase text-gray-dark">Nom</h2>
          <p className="mt-1 text-base text-black">{user.name}</p>
        </div>
        <div>
          <h2 className="text-xs font-medium uppercase text-gray-dark">Adresse e-mail</h2>
          <p className="mt-1 break-all text-base text-black">{user.email}</p>
        </div>
        <div>
          <h2 className="text-xs font-medium uppercase text-gray-dark">Type de compte</h2>
          <p className="mt-1 text-base text-black">
            {user.role === "owner" ? "Hôte" : user.role === "admin" ? "Administrateur" : "Voyageur"}
          </p>
        </div>
      </section>
    </article>
  );
}
