'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { doc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/* ---------------------------- */
/* Relógio regressivo          */
/* ---------------------------- */
function Countdown() {
  const [timeLeft, setTimeLeft] = useState<null | number>(null)

  useEffect(() => {
    const fetchLaunch = async () => {
      const snap = await getDoc(doc(db, 'config', 'launch'))
      const ts = snap.exists() ? (snap.data().launchDate as Timestamp) : null
      if (!ts) return
      setTimeLeft(Math.max(0, ts.toMillis() - Date.now()) / 1000)
    }
    fetchLaunch()

    const id = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? Math.max(0, prev - 1) : prev))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  if (timeLeft === null) return null

  const days = Math.floor(timeLeft / 86400)
  const hours = Math.floor((timeLeft % 86400) / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = Math.floor(timeLeft % 60)

  return (
    <div className="mt-8 flex gap-4 text-xl font-mono">
      {[{ label: 'D', value: days }, { label: 'H', value: hours }, { label: 'M', value: minutes }, { label: 'S', value: seconds }].map(
        ({ label, value }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="rounded-lg bg-[var(--gp-light)] px-4 py-2 text-[var(--gp-dark)] min-w-[4rem]">
              {String(value).padStart(2, '0')}
            </span>
            <span className="mt-1 text-xs text-[var(--gp-dark)]/70">{label}</span>
          </div>
        )
      )}
    </div>
  )
}

/* ---------------------------- */
/* Hero principal               */
/* ---------------------------- */
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

        {/* Botões lado a lado */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          {/* Botão Start for Free */}
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

          {/* Botão Login */}
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

        {/* Relógio regressivo */}
        <Countdown />
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
