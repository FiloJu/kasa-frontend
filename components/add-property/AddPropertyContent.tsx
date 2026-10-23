"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";
import { AddPropertyProvider, useAddProperty } from "@/context/AddPropertyContext";
import MainForm from "@/components/add-property/MainForm";
import Equipments from "@/components/add-property/Equipments";
import HostInfo from "@/components/add-property/HostInfo";
import PropertyImages from "@/components/add-property/Images";

function AddPropertyContentInner() {
  const router = useRouter();
  const { user, loading: authLoading, upgradeToOwner } = useAuthContext();
  const { updateField } = useAddProperty();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [activatingOwner, setActivatingOwner] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerError, setOwnerError] = useState("");
  const errorsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login?returnTo=%2Fadd-property");
      return;
    }

  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.id) {
      updateField("host_id", String(user.id));
    }
  }, [user?.id, updateField]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      errorsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors]);

  if (authLoading || !user) {
    return null;
  }

  if (user.role !== "owner" && user.role !== "admin") {
    async function handleActivateOwner() {
      setActivatingOwner(true);
      setOwnerError("");
      try {
        await upgradeToOwner(ownerPassword);
      } catch (error) {
        setOwnerError(error instanceof Error ? error.message : "Impossible d’activer le profil hôte.");
      } finally {
        setActivatingOwner(false);
      }
    }

    return (
      <article className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-12 md:px-8">
        <Link
          href="/home"
          className="flex h-10 w-fit items-center rounded-[10px] border border-gray-light px-4 text-sm font-medium text-gray-dark hover:bg-gray-100"
        >
          Retour
        </Link>
        <section className="rounded-[10px] border border-gray-light bg-white p-6 md:p-8">
          <h1 className="text-2xl font-semibold">Activez votre profil hôte</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-dark">
            La création d’un logement est réservée aux comptes hôte. Activez ce rôle pour continuer.
          </p>
          <label htmlFor="owner-password" className="mt-5 block text-sm font-medium">
            Confirmez votre mot de passe
          </label>
          <input
            id="owner-password"
            type="password"
            autoComplete="current-password"
            value={ownerPassword}
            onChange={(event) => setOwnerPassword(event.target.value)}
            className="mt-2 h-11 w-full rounded-[4px] border border-gray-light px-3 text-sm"
          />
          {ownerError && <p className="mt-4 text-sm text-red-700" role="alert">{ownerError}</p>}
          <button
            type="button"
            onClick={handleActivateOwner}
            disabled={activatingOwner || !ownerPassword}
            className="mt-6 h-10 rounded-[10px] bg-[#99331A] px-5 text-sm font-medium text-white hover:bg-[#7D2915] disabled:cursor-wait disabled:opacity-60"
          >
            {activatingOwner ? "Activation en cours…" : "Activer mon profil hôte"}
          </button>
        </section>
      </article>
    );
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
          Ajouter une propriété
        </h1>
        <button
          type="submit"
          form="property-form"
          disabled={submitting || uploadingImages}
          className="h-10 rounded-[10px] bg-[#99331A] px-6 text-sm font-medium text-white hover:bg-[#7D2915] disabled:cursor-wait disabled:opacity-60"
        >
          {submitting
            ? "Ajout en cours…"
            : uploadingImages
              ? "Envoi des images…"
              : "Ajouter la propriété"}
        </button>
      </div>

      {errorMessages.length > 0 && (
        <div ref={errorsRef} className="rounded-[10px] border border-red-300 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <p className="font-semibold">Vérifiez les informations suivantes :</p>
          <ul className="mt-2 list-inside list-disc">
            {errorMessages.map((message) => <li key={message}>{message}</li>)}
          </ul>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <MainForm
            onErrorsChange={setErrors}
            onSubmittingChange={setSubmitting}
          />
          <PropertyImages
            errors={errors}
            onUploadingChange={setUploadingImages}
          />
          <Equipments errors={errors} />
        </div>
        <HostInfo />
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