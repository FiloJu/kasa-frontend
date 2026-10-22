import React from "react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#f5f5f5] px-[40px] py-[8px]">
      <div className="w-full max-w-[1240px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Picto Logo */}
        <Logo variant="picto" className="h-[53.36px] w-[46.04px]" />
        
        {/* Right: Copyright */}
        <div className="text-[12px] font-medium text-[#565656]">
          <p>© 2026 Kasa. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}