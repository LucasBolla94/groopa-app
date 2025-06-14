'use client'
import Image from 'next/image'
import dynamic from 'next/dynamic'

/* -------------------------------------------------- */
/*  ⏱️  Countdown (lazy, sem SSR)                     */
/* -------------------------------------------------- */
const Countdown = dynamic(() => import('@/components/home/Countdown'), {
  ssr: false,
})

/* -------------------------------------------------- */
/* Hero principal                                     */
/* -------------------------------------------------- */
export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center gap-6 py-16 px-6 md:flex-row md:text-left md:justify-between">
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[var(--gp-dark)]">
          Groopa: <span className="text-[var(--gp-light)]">Shared Market Lists</span>
        </h1>

        <p className="mt-4 text-lg md:text-xl text-[var(--gp-black)]/80">
          Create, organise and share grocery lists with friends, roommates or the whole family.
          Free &amp; Premium plans — always in sync, everywhere.
        </p>

        {/* Relógio regressivo — agora acima dos botões */}
        <Countdown />

        {/* Botões lado a lado */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          {/* Start for Free (primário) */}
          <a
            href="/auth/register"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold shadow-md
                       bg-[var(--gp-dark)] text-[var(--gp-white)]
                       opacity-50 cursor-not-allowed pointer-events-none
                       transition-all duration-300"
          >
            Start for Free
            <span className="group-hover:translate-x-1 transition-transform">🚀</span>
          </a>

          {/* Login (secundário) */}
          <a
            href="/auth/login"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold shadow-md
                       bg-[var(--gp-light)] text-[var(--gp-dark)]
                       opacity-50 cursor-not-allowed pointer-events-none
                       transition-all duration-300"
          >
            Log In
            <span className="group-hover:translate-x-1 transition-transform">🔐</span>
          </a>
        </div>
      </div>

      {/* Imagem ilustrativa */}
      <Image
        src="/hero.png"
        alt="People collaborating on a shopping list app"
        width={420}
        height={320}
        priority
        className="select-none pointer-events-none"
      />
    </section>
  )
}
