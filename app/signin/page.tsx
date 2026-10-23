import RegisterForm from "../../components/SigninForm";

export default function SigninPage() {
  return (
    <section className="w-full flex justify-center items-center mb-8 pt-8 ">
      
      <div className="w-89.5 md:w-185.5 bg-white rounded-20 border border-gray-light flex flex-col items-center px-4 md:px-10 pt-9 pb-6 md:pt-20 md:pb-16 text-center">

        <h1 className="text-[24px]  md:text-[32px] font-bold text-main-red">
          Rejoignez la <br className="block md:hidden" /> communauté Kasa
        </h1>

        <p className="w-89.5 md:w-122 mt-2 text-[14px] text-black font-normal leading-[1.4]  max-w-137.5">
          Créez votre compte et commencez à voyager autrement : réservez des logements uniques,
          découvrez de nouvelles destinations et partagez <br className="block md:hidden" /> vos propres lieux avec d’autres voyageurs.
        </p>

        <RegisterForm />
      </div>
      
    </section>
  );
}