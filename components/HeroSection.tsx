import Image from "next/image";
import banner from "../public/assets/hero-home.png";

export default function HeroSection() {
  return (
    <section
      className="w-full max-w-85.5 md:max-w-145 lg:max-w-278.75 flex flex-col items-center mt-10 mx-auto"
      aria-labelledby="hero-title"
    >
      <h1
        id="hero-title"
        className="text-main-red text-[32px] font-bold text-center"
      >
        Chez vous, <br className="block md:hidden" />partout et ailleurs
      </h1>

      <p className="text-[14px] text-black text-center">
        Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes.
      </p>

      <div className="relative h-114.5 w-88.75 md:w-183.5 lg:w-full mt-10">

        <Image
          src={banner}
          alt="Illustration d’un paysage accueillant représentant le confort et le voyage"
          fill
          className="object-cover rounded-20"
          priority
        />
      </div>
    </section>
  );
}