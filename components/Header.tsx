"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full flex flex-col items-center text-center py-8 md:py-12">
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-gold overflow-hidden">
        <Image
          src="/pastor.jpg"
          alt="Pastor Mrs. Oluwatosin Afolabi"
          fill
          className="object-cover"
          priority
        />
      </div>

      <p className="mt-5 font-lato text-xs uppercase tracking-widest text-light-gold">
        DAILY QUOTES BY
      </p>

      <h1 className="mt-1 font-playfair italic font-bold text-3xl md:text-4xl text-gold">
        Pastor Mrs. Oluwatosin Afolabi
      </h1>

      <div className="w-[60px] h-px bg-gold mx-auto mt-3" />

      <p className="mt-3 font-lato text-sm md:text-base text-white/70 italic">
        Walk daily in faith, hope, and grace
      </p>
    </header>
  );
}
