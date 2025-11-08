import React from "react";
import { motion } from "framer-motion";

export default function Echipa() {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center pt-32">
      <div className="absolute top-0 left-0 w-2/5 h-40 bg-[#E25445] -z-10 clip-path-triangle-tl" />
      <div className="absolute bottom-0 right-0 w-2/5 h-40 bg-[#0E1B63] -z-10 clip-path-triangle-br" />

      <motion.div
        className="max-w-5xl mx-auto px-6 py-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-black mb-8">
          Despre noi
        </h1>

        <motion.p
          className="text-xl md:text-2xl font-semibold text-black mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          "A drop of ink may make <br />
          a <span className="underline font-bold">million</span> think."
        </motion.p>

        <motion.p
          className="text-base md:text-lg text-gray-800 italic mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          – Lord Byron –
        </motion.p>

        <motion.div
          className="text-gray-800 leading-relaxed max-w-3xl mx-auto space-y-6 text-justify text-sm md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          <p>
            Istoria <span className="font-semibold">Gazetei CNVA</span> e cuprinsă toată într-o imagine sepia veche, 
            pe care o găsești întâmplător într-o amintire: pe fundal – ecoul pașilor din curtea liceului, în centru – câțiva adolescenți, 
            o sală de clasă și fervoarea amestecată cu ezitările începutului. Era 2014, când un mic grup de elevi ai Colegiului Național 
            Vasile Alecsandri din Galați au hotărât că au ceva de împărtășit și își doresc să fie ascultați.
          </p>

          <p>
            Reviste cu un istoric bogat mai existaseră – emblematica publicație <em>Aripi</em>, spre exemplu – dar adolescenții de atunci au simțit 
            că este nevoie de un nou format. Așa s-a născut <strong>Gazeta CNVA</strong>, care a apărut inițial doar online, nu ca un ziar clasic, 
            ci ca o fereastră deschisă către sufletul liceului.
          </p>

          <p>
            Au urmat ani în care cuvintele s-au așezat cuminți sau neliniștite pe pagini, în care voci inițial fragile au prins curaj, 
            în care idei nebunești au devenit posibile. Gazeta a crescut împreună cu elevii care scriau și cu cei care citeau. 
            Apoi, pentru o vreme, s-a făcut liniște. Doi ani de pauză, în care vocile s-au ascuns în caiete sau în notițele din telefon, 
            dar n-au dispărut. Doar așteptau momentul potrivit să revină.
          </p>

          <p>
            Iar momentul acesta a fost în <strong>2024</strong>, când Gazeta s-a trezit din nou… în altă sală de clasă, cu altă generație, 
            dar cu același dor al adolescenților de a scrie și de a fi înțeleși. Impulsul a venit de la doi elevi de la mate-info, 
            <strong> Ionuț Țîru</strong> și <strong>Ștefan Savin</strong>, cei care au transformat dorința într-un proiect real: 
            au adunat o echipă nouă, au gândit aproape fiecare pas și au demonstrat că generația lor nu doar visează, ci și construiește. 
            Alături de <strong>prof. Elena Gorovei</strong>, cu care am coordonat și generația anterioară de gazetari, am știut că renașterea revistei 
            nu e doar un proiect editorial, ci un act de curaj colectiv.
          </p>

          <p>
            Pentru mine, <strong>Gazeta</strong> nu e doar o revistă. E o oglindă și, de multe ori, o hartă. 
            O oglindă care ne arată cine suntem – cu vulnerabilități, exaltări, contradicții. 
            O hartă care ne reconstituie traseele interioare și ne ajută să înțelegem unde vrem să ajungem. 
            A scrie – și mai ales a împărtăși ceea ce scrii – devine un mod de a-ți descoperi propria voce.
          </p>

          <p>
            Rolul Gazetei CNVA nu e doar să informeze, ci și să transforme, pentru că atunci când un elev își vede numele tipărit 
            lângă un text care îi aparține, ceva se schimbă: își dă seama că ideile lui au greutate, că emoțiile lui pot fi recunoscute. 
            Scriitura devine punte între lumi – între colegi, între generații, între școală și comunitate.
          </p>

          <p>
            Această ediție pornește de la o întrebare care a devenit laitmotivul nostru: 
            <span className="italic font-semibold"> Ce ai face dacă nu ți-ar fi frică? </span> 
            Pentru unii dintre autori, răspunsul înseamnă să scrie prima poezie, pentru alții, 
            să-și spună părerea într-un articol de opinie. Pentru noi, înseamnă să avem curajul 
            de a le da adolescenților spațiul să simtă, să creeze, să greșească și să învețe din asta.
          </p>

          <p>
            Gazeta CNVA nu e doar jurnalism și literatură – e despre <em>apartenență</em>, 
            despre a ști că există un loc unde vocea ta contează, unde fiecare gând – fie el luminos sau plin de îndoieli – are loc pe pagină. 
            Revista devine o arhivă vie a emoțiilor unei generații.
          </p>

          <p>
            Mă gândesc cu recunoștință la cei care au început povestea în 2014, la cei care o continuă acum, 
            la toți cei care vor deschide această revistă și vor descoperi ceva din ei înșiși în paginile ei. 
            Am învățat că a scrie înseamnă să supraviețuiești propriei tale prăbușiri și să spui adevărul chiar atunci când doare. 
            Fiecare număr al Gazetei seamănă cu o încercare de zbor: abia schițată la început, apoi tot mai sigură, 
            mai puternică, ridicându-ne deasupra fricii.
          </p>

          <p>
            Te invit să pășești pe drumul acesta împreună cu noi și să te întrebi, la fiecare pagină:{" "}
            <span className="font-semibold italic">Ce aș face dacă nu mi-ar fi frică?</span>
          </p>

          <p className="text-right font-semibold mt-8">
            prof. dr. Cătălina-Diana Popa
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
