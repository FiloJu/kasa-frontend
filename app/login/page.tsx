"use client";
import LoginForm from "@/components/LoginForm";

/** Renders the sign-in page and its authentication form. */
export default function LoginPage() {
  return (
    <section className="w-full flex justify-center items-center mb-14 mt-14 ">
      <div className="w-185.5 h-125 md:h-147.5 bg-white rounded-20 border border-gray-light flex flex-col items-center pt-8 md:pt-18 text-center">

        <h1 className="text-[24px] md:text-[32px] font-bold text-main-red">
          Heureux de vous revoir
        </h1>

        <p className="mt-1 text-[14px] text-black font-normal leading-[1.4] max-w-125">
          Connectez-vous pour retrouver vos réservations,<br className="md:hidden" /> vos  <br className="hidden md:block" /> annonces et tout ce qui rend vos séjours <br className="md:hidden" /> uniques.
        </p>

        <LoginForm />

      </div>
    </section>
  );
}
