"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";
import { AddPropertyProvider, useAddProperty } from "@/context/AddPropertyContext";
import MainForm from "@/components/add-property/MainForm";

function AddPropertyContentInner() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const { updateField } = useAddProperty();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login?returnTo=%2Fadd-property");
      return;
    }

    if (user.role !== "owner") {
      router.replace("/home");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.id) {
      updateField("host_id", String(user.id));
    }
  }, [user?.id, updateField]);

  if (authLoading || !user || user.role !== "owner") {
    return null;
  }

  const errorMessages = Object.values(errors);

  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <Link
        href="/home"
        className="flex h-10 w-fit items-center rounded-[10px] border border-gray-light px-4 text-sm font-medium text-gray-dark hover:bg-gray-100"
      >
        Retour
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 id="add-property-title" className="text-2xl font-semibold">
          Ajouter un logement
        </h1>
        <button
          type="submit"
          form="property-form"
          disabled={submitting}
          className="h-10 rounded-[10px] bg-[#99331A] px-6 text-sm font-medium text-white hover:bg-[#7D2915] disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Ajout en cours…" : "Ajouter le logement"}
        </button>
      </div>

      {errorMessages.length > 0 && (
        <div className="rounded-[10px] border border-red-300 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <p className="font-semibold">Vérifiez les informations suivantes :</p>
          <ul className="mt-2 list-inside list-disc">
            {errorMessages.map((message) => <li key={message}>{message}</li>)}
          </ul>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <MainForm
          onErrorsChange={setErrors}
          onSubmittingChange={setSubmitting}
        />

        <aside className="rounded-[10px] border border-gray-light bg-white p-5">
          <h2 className="text-lg font-semibold">Votre profil hôte</h2>
          <p className="mt-3 text-sm font-medium">{user.name}</p>
          <p className="mt-1 break-all text-sm text-gray-dark">{user.email}</p>
        </aside>
      </div>
    </article>
  );
}

export default function AddPropertyContent() {
  return (
    <AddPropertyProvider>
      <AddPropertyContentInner />
    </AddPropertyProvider>
  );
}