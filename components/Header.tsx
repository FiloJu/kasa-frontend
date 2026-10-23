"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";

import heartIcon from "../public/icons/heart.svg";
import messageIcon from "../public/icons/message.svg";

import { useAuthContext } from "@/context/AuthContext";
import { useFavoritesContext } from "@/context/FavoritesContext";
import { useMessaging } from "@/context/MessagingContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Always call hooks.
  const { user, logout } = useAuthContext();
  const favoritesCtx = useFavoritesContext();
  const messagingCtx = useMessaging();

  // Only use their values when a user exists.
  const favoritesCount = user ? favoritesCtx.favorites.length : 0;
  const unreadCount = user ? messagingCtx.unreadCount : 0;

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function handleLogout() {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    await logout();
  }

  return (
    <header ref={headerRef} className="relative z-50 flex w-full justify-center px-2 pt-2 md:px-0 md:pt-8">
      <div className="relative flex h-16 w-full max-w-195.5 items-center justify-between rounded-10 bg-white px-4 md:h-[56px]">

        {/* Navigation left */}
        <nav className="hidden gap-5 md:flex">
          <Link href="/" className="w-15 text-[14px] hover:text-main-red hover:font-bold">Accueil</Link>
          <Link href="/about" className="w-footer text-[14px] hover:text-main-red hover:font-bold">À propos</Link>
        </nav>

        {/* Center logo */}
        <div className="hidden md:absolute md:left-[42%] md:block md:-translate-x-1/2">
          <Logo size="small" />
        </div>

        {/* Right actions */}
        <div className="ml-auto hidden items-center gap-4 text-[12px] md:flex">
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
          <Link href="/messages" className="relative">
            <Image src={messageIcon} alt="Messages" width={20} height={20} className="w-3 h-3" />
            {user && unreadCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-main-red text-white text-[12px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          {user && (
            <div className="relative">
              <button
                type="button"
                aria-label={`Ouvrir le menu du compte de ${user.name}`}
                aria-expanded={accountMenuOpen}
                aria-controls="account-menu"
                onClick={() => setAccountMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#99331A]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 fill-none stroke-current text-gray-dark"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="3.25" />
                  <path d="M5.5 20c.45-3.2 2.85-5.25 6.5-5.25s6.05 2.05 6.5 5.25" />
                </svg>
              </button>
              {accountMenuOpen && (
                <nav
                  id="account-menu"
                  aria-label="Menu du compte"
                  className="absolute right-0 top-full mt-2 flex w-52 flex-col rounded-[10px] border border-gray-light bg-white p-2 shadow-lg"
                >
                  <Link
                    href="/profile"
                    onClick={() => setAccountMenuOpen(false)}
                    className="rounded-[6px] px-3 py-2.5 text-sm text-black hover:bg-[#FFFBF9]"
                  >
                    Mon profil
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-[6px] px-3 py-2.5 text-left text-sm text-[#99331A] hover:bg-[#FFFBF9]"
                  >
                    Déconnexion
                  </button>
                </nav>
              )}
            </div>
          )}
        </div>

        {/* Mobile header */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link href="/" aria-label="Accueil" onClick={() => setMobileMenuOpen(false)}>
            <Logo variant="picto" />
          </Link>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#99331A]"
          >
            <Image
              src={mobileMenuOpen ? "/icons/close.svg" : "/icons/menu.svg"}
              alt=""
              width={24}
              height={24}
              className="h-6 w-auto"
            />
          </button>
        </div>

      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigation mobile"
          className="absolute left-2 right-2 top-full mt-2 flex flex-col gap-5 rounded-10 bg-white p-6 shadow-lg md:hidden"
        >
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-lg">Accueil</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg">À propos</Link>
          <Link href="/messages" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-lg">
            Messagerie
            {user && unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#99331A] px-1 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-lg">
            Favoris
            {user && favoritesCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#99331A] px-1 text-xs font-bold text-white">
                {favoritesCount}
              </span>
            )}
          </Link>
          {user && (
            <>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-lg">
                Mon profil
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 items-center justify-center rounded-[10px] border border-[#99331A] px-4 text-sm font-medium text-[#99331A]"
              >
                Déconnexion
              </button>
            </>
          )}
          <Link
            href="/add-property"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-11 items-center justify-center rounded-[10px] bg-[#99331A] px-4 text-sm font-medium text-white hover:bg-[#7D2915]"
          >
            Ajouter un logement
          </Link>
        </nav>
      )}
    </header>
  );
}