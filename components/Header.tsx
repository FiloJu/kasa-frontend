"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from '@/components/Logo'

import heartIcon from "../public/icons/heart.svg";
import messageIcon from "../public/icons/message.svg";

import { useAuthContext } from "@/app/context/AuthContext";
import { useFavoritesContext } from "@/app/context/FavoritesContext";
import { useMessaging } from "@/app/context/MessagingContext";

export default function Header() {
  // Always call hooks.
  const { user } = useAuthContext();
  const favoritesCtx = useFavoritesContext();
  const messagingCtx = useMessaging();

  // Only use their values when a user exists.
  const favoritesCount = user ? favoritesCtx.favorites.length : 0;
  const unreadCount = user ? messagingCtx.unreadCount : 0;

  return (
    <header className="w-full flex justify-center pt-8 relative z-50">
      <div className="w-full max-w-195.5 h-[56px] bg-white rounded-10 flex items-center justify-center gap-12 px-4">

        {/* Navigation left */}
        <nav className="flex gap-5">
          <Link href="/" className="w-15 text-[14px] hover:text-main-red hover:font-bold">Accueil</Link>
          <Link href="/about" className="w-footer text-[14px] hover:text-main-red hover:font-bold">À propos</Link>
        </nav>

        {/* Center logo */}
        <div>
          <Logo />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 text-[12px]">
          {user && <p>Bonjour {user.name}</p>}

          <Link href="/add-property" className="flex items-center gap- text-main-red text-[14px] mr-4">
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 text-[12px]">
          {user && <p>Bonjour {user.name}</p>}

          <Link href="/add-property" className="flex items-center gap- text-main-red text-[14px] mr-4">
            + Ajouter un logement
          </Link>

          {/* Favorites */}
          <Link href="/favorites" className="relative">
            <Image src={heartIcon} alt="Favoris" width={20} height={20} className="w-3 h-3" />
            {user && favoritesCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-main-red text-white text-[12px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Link>

          <div className="w-px h-2 bg-main-red"></div>

          {/* Messages */}
          <Link href="/messaging" className="relative">
            <Image src={messageIcon} alt="Messages" width={20} height={20} className="w-3 h-3" />
            {user && unreadCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-main-red text-white text-[12px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}