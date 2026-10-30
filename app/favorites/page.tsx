"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import PropertyCard from "@/components/PropertyCard";
import { useAuthContext } from "@/context/AuthContext";
import { useFavoritesContext } from "@/context/FavoritesContext";

/** Displays the signed-in user's saved properties. */
export default function FavoritesPage() {
	const router = useRouter();
	const { user, loading: authLoading } = useAuthContext();
	const { properties, loading, error } = useFavoritesContext();

	useEffect(() => {
		if (!authLoading && !user) {
			router.replace("/login?returnTo=%2Ffavorites");
		}
	}, [authLoading, user, router]);

	if (authLoading || !user) return null;

	return (
		<div className="mx-auto flex w-full max-w-278.75 flex-col items-center px-4">
			<h1 className="mt-8 text-center text-[32px] font-bold text-main-red">
				Vos favoris
			</h1>

			<p className="mt-4 text-center text-[14px] font-normal leading-relaxed text-black md:mb-8">
				Retrouvez ici tous les logements que vous avez aimés.
				<br className="hidden md:block" />
				Prêts à réserver ? Un simple clic et votre prochain séjour est en route.
			</p>

			{error && (
				<p className="mt-8 w-full text-center text-sm text-red-700" role="alert">
					{error}
				</p>
			)}

			<div className="mx-auto mb-16 mt-10 flex w-full max-w-278.75 flex-wrap justify-center gap-6 lg:justify-start">
				{loading ? (
					<p className="w-full text-center text-gray-dark" role="status">
						Chargement des favoris…
					</p>
				) : error ? null : properties.length > 0 ? (
					properties.map((property) => (
						<PropertyCard key={property.id} property={property} />
					))
				) : (
					<p className="w-full text-center text-gray-dark">
						Vous n’avez encore aucun favori.
					</p>
				)}
			</div>
		</div>
	);
}
