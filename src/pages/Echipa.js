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
          Echipa
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

        <motion.p
          className="text-gray-800 leading-relaxed max-w-3xl mx-auto mb-16 text-sm md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          Mulți își doresc să se afirme, să devină cunoscuți, apreciați, să le fie
          adresate doar cuvinte de laudă, însă prea puțini sunt cei care îmbrățișează
          curajul de a scrie, de a fi autentici. Din echipa Gazetei CNVA fac parte
          doar tineri care îndrăznesc să gândească liber, în forme ciudate și în
          culori trăsnite; tineri care nu se cantonează în clișeele societății și
          care pătrund dincolo de tot ceea ce, pentru cei mulți, ar fi doar o banalitate.
        </motion.p>
      </motion.div>
    </section>
  );
}