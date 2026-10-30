"use client";

import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";

/** Displays the signed-in host's profile details in the property form. */
export default function HostInfo() {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <section
      aria-labelledby="host-info-title"
      className="flex w-full flex-col gap-4 rounded-[10px] border border-gray-light bg-white p-5 md:p-8"
    >
      <h2 id="host-info-title" className="text-[18px] font-semibold text-black">
        Profil hôte
      </h2>

      <div className="flex items-center gap-3">
        {user.picture ? (
          <Image
            src={user.picture}
            alt={`Photo de profil de ${user.name}`}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFFBF9] text-lg font-semibold text-[#99331A]"
          >
            {user.name.charAt(0).toLocaleUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-black">{user.name}</p>
          <p className="break-all text-sm text-gray-dark">{user.email}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-gray-dark">
        Ces informations proviennent de votre compte et ne peuvent pas être modifiées ici.
      </p>
    </section>
  );
}