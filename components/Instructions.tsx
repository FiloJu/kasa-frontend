/** Explains the three main steps for using the Kasa platform. */
export default function Instructions() {
  return (
    <section
      className="w-88.5 lg:w-278.75 mx-auto bg-white flex flex-col items-center mt-10 mb-10"
      aria-labelledby="how-it-works-title"
    >
      <h2
        id="how-it-works-title"
        className="text-[24px] font-semibold text-center text-black mt-10"
      >
        Comment ça marche ?
      </h2>

      <p className="text-[14px] text-black mt-4 text-center">
        Que vous partiez pour un week-end improvisé, des vacances en famille ou un voyage professionnel,<br />
        Kasa vous aide à trouver un lieu qui vous{" "}
        <br className="block md:hidden" />
        ressemble.
      </p>


      <div className="flex flex-col lg:flex-row gap-6 mt-10 mb-10" role="list">
        {/* Card 1 */}
        <article
          role="listitem"
          className="w-88.5 lg:w-67.5 h-48.75 border bg-[#842C16] rounded-[10px] p-5 text-white"
        >
          <h3 className="text-[18px] font-medium mt-5">Recherchez</h3>
          <p className="text-[12px] mt-4">
           Entrez votre destination, vos dates et laissez Kasa faire le reste
          </p>
        </article>

        {/* Card 2 */}
        <article
          role="listitem"
          className="w-88.5 lg:w-67.5 h-48.75 border bg-[#842C16] rounded-[10px] p-5 text-white"
        >
          <h3 className="text-[18px] font-medium mt-5">Réservez</h3>
          <p className="text-[12px] mt-4">
            Profitez d’une plateforme sécurisée et de profils d’hôtes vérifiés.
          </p>
        </article>

        {/* Card 3 */}
        <article
          role="listitem"
          className="w-88.5 lg:w-67.5 h-48.75 border bg-[#842C16] rounded-[10px] p-5 text-white"
        >
          <h3 className="text-[18px] font-medium mt-5">Vivez l’expérience</h3>
          <p className="text-[12px] mt-4">
            Installez-vous, profitez de votre séjour, et sentez-vous chez vous, partout.
          </p>
        </article>
      </div>
    </section>
  );
}