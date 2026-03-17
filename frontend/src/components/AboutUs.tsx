import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1026] via-[#1b1f4b] to-[#3b1d5c] text-white">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-teal-300 uppercase tracking-[0.3em] text-sm font-semibold mb-4">
              About ReTech
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Technológiának második életet adni.
            </h1>
            <p className="mt-6 text-lg text-blue-100/85 leading-8 max-w-2xl">
              A ReTech ötlete abból a mindennapi problémából született, hogy sokan
              rendelkezünk olyan működő elektronikai eszközökkel — legyen szó
              okostelefonról, laptopról vagy tabletről — amelyeket már nem használunk,
              mégis nehéz számukra megbízható és biztonságos új tulajdonost találni.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/products")}
                className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-full transition"
                type="button"
              >
                Termékek megtekintése
              </button>

              <button
                onClick={() => navigate("/")}
                className="border border-white/20 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-full transition"
                type="button"
              >
                Vissza a főoldalra
              </button>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1400&q=80"
              alt="Technológiai munkakörnyezet"
              className="rounded-3xl shadow-2xl border border-white/10 object-cover w-full h-[420px]"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-white/5 border-y border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-teal-300 uppercase tracking-[0.25em] text-sm font-semibold">
              Küldetésünk
            </p>
            <h2 className="mt-3 text-3xl font-bold">Bizalommal újrahasználni.</h2>
          </div>

          <div className="md:col-span-2 text-blue-100/85 text-lg leading-8">
            Célunk egy modern, mobilbarát és gyors weboldal létrehozása volt, amely
            nem csupán piactér, hanem egy felelős közösségi tér is. Olyan platformot
            szerettünk volna építeni, ahol az elektronikai eszközök új életet kapnak,
            a felhasználók pedig bizalommal és egyszerűen tudnak adni-venni.
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 space-y-10">
        <div className="bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-sm">
          <h3 className="text-3xl font-bold">Mi teszi egyedivé a ReTech-et?</h3>
          <p className="mt-6 text-lg text-blue-100/80 leading-8">
            A projekt középpontjában a bizalom áll: minden egyes termék valódi
            ellenőrzésen megy keresztül, mielőtt megjelenik a platformon. Ez garantálja,
            hogy a ReTech kizárólag hiteles és megbízható ajánlatokat kínáljon.
            Nálunk nem az ár az elsődleges szempont, hanem a minőség, a biztonság
            és a környezettudatosság.
          </p>
        </div>

        <div className="bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-sm">
          <h3 className="text-3xl font-bold">Technológiai háttér</h3>
          <p className="mt-6 text-lg text-blue-100/80 leading-8">
            A fejlesztés során fontos szempont volt, hogy korszerű, iparágban is
            használt technológiákat alkalmazzunk, mint a React, a Tailwind CSS,
            a NestJS és a Prisma. Ezek stabil, skálázható alapot biztosítanak, miközben
            lehetővé teszik egy gyors, intuitív és felhasználóbarát élmény kialakítását.
          </p>
        </div>

        <div className="bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-sm">
          <h3 className="text-3xl font-bold">A probléma és a megoldás</h3>
          <p className="mt-6 text-lg text-blue-100/80 leading-8">
            Az alkalmazás egy valós és egyre gyakoribb problémára kínál megoldást:
            a működő, de már nem használt elektronikai eszközök biztonságos,
            átlátható és környezettudatos újraforgalmazása jelenleg nehézkes.
            Sokan otthon tárolják ezeket az eszközöket, mert tartanak az átverésektől,
            a bizonytalan vásárlóktól vagy a túl bonyolult eladási folyamattól.
            A ReTech erre a helyzetre ad választ egy megbízható, ellenőrzött és korszerű
            platformmal, amely egyszerre szolgálja a felhasználók biztonságát és
            a fenntarthatóságot.
          </p>
        </div>
      </section>
    </div>
  );
}