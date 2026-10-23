import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import PropertyGallery from "@/components/property/PropertyGallery";
import { getPropertyById } from "@/lib/properties";

type PageProps = {
	params: Promise<{ id: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kasa.fr";

async function loadProperty(id: string) {
	try {
		return await getPropertyById(id);
	} catch {
		return null;
	}
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { id } = await params;
	const property = await loadProperty(id);

	if (!property) {
		return { title: "Logement introuvable" };
	}

	const pictures = property.pictures?.length ? property.pictures : [property.cover];
	const canonicalUrl = `${siteUrl}/properties/${property.id}`;

	return {
		title: property.title,
		description: property.description,
		alternates: { canonical: canonicalUrl },
		openGraph: {
			title: property.title,
			description: property.description,
			url: canonicalUrl,
			siteName: "Kasa",
			images: pictures,
			locale: "fr_FR",
			type: "article",
		},
		twitter: {
			card: "summary_large_image",
			title: property.title,
			description: property.description,
			images: pictures,
		},
	};
}

export default async function PropertyPage({ params }: PageProps) {
	const { id } = await params;
	const property = await loadProperty(id);

	if (!property) notFound();

	const pictures = property.pictures?.length ? property.pictures : [property.cover];
	const propertyUrl = `${siteUrl}/properties/${property.id}`;
	const schema = {
		"@context": "https://schema.org",
		"@type": "LodgingBusiness",
		name: property.title,
		description: property.description,
		image: pictures,
		url: propertyUrl,
		address: {
			"@type": "PostalAddress",
			addressLocality: property.location,
			addressCountry: "FR",
		},
		...(property.ratings_count > 0 && {
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: property.rating_avg,
				bestRating: 5,
				ratingCount: property.ratings_count,
			},
		}),
		host: {
			"@type": "Person",
			name: property.host.name,
			image: property.host.picture,
		},
	};
	const schemaJson = JSON.stringify(schema).replace(/</g, "\\u003c");

	return (
		<article className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-12 pt-6 md:px-8 md:pt-10">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: schemaJson }}
			/>

			<div className="flex flex-wrap items-center justify-between gap-4">
				<Button
					variant="light"
					href="/properties"
					icon={<Icon name="back" size={14} alt="" />}
					className="w-fit px-4"
				>
					Retour aux annonces
				</Button>
				<p className="text-sm font-medium text-gray-dark">
					{property.price_per_night} € <span className="font-normal">par nuit</span>
				</p>
			</div>

			<PropertyGallery images={pictures} title={property.title} />

			<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
				<section className="flex min-w-0 flex-col gap-8 rounded-[10px] bg-white p-5 md:p-8">
					<div className="flex flex-col gap-4">
						<h1 className="text-2xl font-semibold text-black md:text-3xl">
							{property.title}
						</h1>
						<p className="flex items-center gap-2 text-sm text-gray-dark">
							<Icon name="location" size={16} alt="Localisation" />
							{property.location}
						</p>
						<p className="whitespace-pre-line text-sm leading-relaxed text-black">
							{property.description}
						</p>
					</div>

					{property.equipments && property.equipments.length > 0 && (
						<section aria-labelledby="equipment-title" className="flex flex-col gap-4">
							<h2 id="equipment-title" className="text-base font-semibold">Équipements</h2>
							<ul className="flex flex-wrap gap-2">
								{property.equipments.map((equipment) => (
									<li key={equipment} className="rounded-[8px] bg-gray-100 px-3 py-2 text-sm text-gray-dark">
										{equipment}
									</li>
								))}
							</ul>
						</section>
					)}

					{property.tags && property.tags.length > 0 && (
						<section aria-labelledby="categories-title" className="flex flex-col gap-4">
							<h2 id="categories-title" className="text-base font-semibold">Catégories</h2>
							<ul className="flex flex-wrap gap-2">
								{property.tags.map((tag) => (
									<li key={tag} className="rounded-[8px] border border-gray-light px-3 py-2 text-sm text-gray-dark">
										{tag}
									</li>
								))}
							</ul>
						</section>
					)}
				</section>

				<aside className="flex flex-col gap-4 rounded-[10px] bg-white p-5 md:p-8">
					<h2 className="text-base font-semibold text-black">Votre hôte</h2>
					<div className="flex items-center gap-4">
						<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
							{property.host.picture ? (
								<Image
									src={property.host.picture}
									alt={`Photo de ${property.host.name}`}
									fill
									sizes="64px"
									className="object-cover"
									unoptimized
								/>
							) : (
								<span className="flex h-full items-center justify-center text-xl font-semibold text-[#99331A]">
									{property.host.name.charAt(0).toLocaleUpperCase()}
								</span>
							)}
						</div>
						<p className="font-medium text-black">{property.host.name}</p>
					</div>

					<div className="flex items-center justify-between border-t border-gray-light pt-4">
						<span className="text-sm text-gray-dark">Note moyenne</span>
						<span className="flex items-center gap-1 rounded-[8px] bg-gray-100 px-3 py-2 text-sm font-medium text-black">
							<Icon name="star" size={16} alt="Note" />
							{property.rating_avg.toFixed(1)} / 5
						</span>
					</div>
					<p className="text-xs text-gray-dark">
						{property.ratings_count === 0
							? "Aucun avis pour le moment"
							: `${property.ratings_count} avis`}
					</p>
				</aside>
			</div>
		</article>
	);
}
