import React from "react";
import Image from "next/image";

/** Configuration options for the responsive Kasa logo. */
type LogoProps = {
  className?: string;
  variant?: "default" | "picto";
  size?: "small" | "large";
};

/**
 * Renders the full Kasa wordmark or its compact pictogram.
 *
 * @param props - Logo appearance options.
 * @returns The selected logo variant.
 */
export default function Logo({ className = "", variant = "default", size = "large" }: LogoProps) {
  if (variant === "picto") {
    return (
      <div className={`relative h-[53.36px] w-[46.04px] shrink-0 ${className}`}>
        <Image
          src="/assets/logo-picto.svg"
          alt="Kasa Picto Logo"
          fill
          className="object-contain"
        />
      </div>
    );
  }

  // Sizing dimensions for the full logo
  const dimensions =
    size === "small"
      ? { width: "w-[113.28px]", height: "h-[40.05px]" }
      : { width: "w-[162.24px]", height: "h-[57.36px]" };

  // Use header-specific assets for small version, default assets for large version
  const assets =
    size === "small"
      ? {
          k: "/assets/logo-header-k.svg",
          house: "/assets/logo-header-house.svg",
          s: "/assets/logo-header-s.svg",
          a: "/assets/logo-header-a.svg",
        }
      : {
          k: "/assets/logo-k.svg",
          house: "/assets/logo-house.svg",
          s: "/assets/logo-s.svg",
          a: "/assets/logo-a.svg",
        };

  return (
    <div className={`relative ${dimensions.width} ${dimensions.height} shrink-0 ${className}`}>
      {/* letter 'k' */}
      <div className="absolute inset-[0_76.85%_15.8%_0]">
        <div className="absolute inset-[0_4.99%_0_0] relative w-full h-full">
          <Image src={assets.k} alt="k" fill className="object-contain" />
        </div>
      </div>
      
      {/* letter 'a' (house shape) */}
      <div className="absolute inset-[6.97%_46.01%_0_25.61%]">
        <Image src={assets.house} alt="a" fill className="object-contain" />
      </div>

      {/* letter 's' */}
      <div className="absolute inset-[22.66%_23.91%_13.33%_56.46%]">
        <Image src={assets.s} alt="s" fill className="object-contain" />
      </div>

      {/* letter 'a' */}
      <div className="absolute inset-[22.66%_0_13.33%_78.56%]">
        <Image src={assets.a} alt="a" fill className="object-contain" />
      </div>
    </div>
  );
}