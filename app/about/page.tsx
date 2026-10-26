import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Découvrez la mission de Kasa, plateforme de location entre particuliers en France.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 md:gap-10 px-4 md:px-8 lg:px-0 pb-10 max-w-6xl mx-auto">

      {/* Page introduction */}
      <section className="flex flex-col gap-4 text-center pt-10">
        <h1 className="text-[32px] text-center font-bold text-main-red">
              À propos
            </h1>

            <p className="max-w-185.5 mt-1 text-[14px] mx-auto text-center font-normal text-black leading-relaxed">
              Chez Kasa, nous croyons que chaque voyage<br className="block md:hidden" /> mérite un lieu unique où se sentir bien.
              <span className="block h-3"></span>
              Depuis notre création, nous mettons en relation des voyageurs en quête d’authenticité
              avec des hôtes passionnés qui aiment partager leur région et leurs bonnes adresses.
            </p>
      </section>

      {/* Main image */}
      <div className="relative w-full h-[250px] md:h-[350px] rounded-[20px] overflow-hidden">
        <Image
          src="/assets/hero-a-propos.png"
          alt="Maison en bois avec terrasse entourée de verdure"
          fill
          className="object-cover"
        />
      </div>

      {/* Mission section */}
      <section className="flex flex-col lg:flex-row gap-8 lg:gap-10">

        {/* Mission content */}
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-body-md font-semibold text-red-main">Notre mission est simple :</h2>
          <ol className="flex flex-col gap-4 list-decimal list-inside text-body-sm text-black">
            <li>Offrir une plateforme fiable et simple d&apos;utilisation</li>
            <li>Proposer des hébergements variés et de qualité</li>
            <li>Favoriser des échanges humains et chaleureux entre hôtes et voyageurs</li>
          </ol>

          {/* Supporting image for mobile and tablet */}
          <div className="lg:hidden relative h-[280px] rounded-[20px] overflow-hidden">
            <Image
              src="/assets/content-a-propos.png"
              alt="Chalet avec toit triangulaire illuminé au crépuscule"
              fill
              className="object-cover"
            />
          </div>

          <p className="text-body-lg font-semibold text-red-main">
            Que vous cherchiez un appartement cosy en centre-ville, une maison en bord de mer ou un chalet à la montagne, Kasa vous accompagne pour que chaque séjour devienne un souvenir inoubliable.
          </p>
        </div>

        {/* Supporting image for desktop */}
        <div className="hidden lg:block lg:w-[380px] shrink-0 relative h-[350px] rounded-[20px] overflow-hidden">
          <Image
            src="/assets/content-a-propos.png"
            alt="Chalet avec toit triangulaire illuminé au crépuscule"
            fill
            className="object-cover"
          />
        </div>

      </section>
    </div>
  )
}