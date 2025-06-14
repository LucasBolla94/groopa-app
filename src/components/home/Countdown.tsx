'use client'
import { useEffect, useState } from 'react'
import { doc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Unit = { label: 'D' | 'H' | 'M' | 'S'; value: number }

/* -------------------------------------------------- */
/* Hook: calcula o time-left em segundos              */
/* -------------------------------------------------- */
function useLaunchCountdown() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, 'start-date', 'start'))
      const ts = snap.exists() ? (snap.data().date as Timestamp) : null
      if (!ts) return
      setSecondsLeft(Math.max(0, ts.toMillis() - Date.now()) / 1000)
    }
    load()

    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev !== null ? Math.max(0, prev - 1) : prev))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return secondsLeft
}

/* -------------------------------------------------- */
/* Countdown Component                                */
/* -------------------------------------------------- */
export default function Countdown() {
  const secondsLeft = useLaunchCountdown()
  if (secondsLeft === null) return null

  const days = Math.floor(secondsLeft / 86400)
  const hours = Math.floor((secondsLeft % 86400) / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = Math.floor(secondsLeft % 60)

  const units: Unit[] = [
    { label: 'D', value: days },
    { label: 'H', value: hours },
    { label: 'M', value: minutes },
    { label: 'S', value: seconds },
  ]

  /* util: formata “02” */
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="mt-8 flex gap-3 sm:gap-6 justify-center">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <span
            className={`flex items-center justify-center rounded-xl shadow-md ring-2 ring-[var(--gp-light)]
                        bg-[var(--gp-dark)] text-[var(--gp-white)]
                        w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24
                        text-2xl sm:text-3xl md:text-4xl font-bold
                        ${label !== 'S' ? '' : 'animate-pulse'}`}
          >
            {pad(value)}
          </span>
          <span className="mt-2 text-[10px] sm:text-xs md:text-sm tracking-wider text-[var(--gp-dark)]/90">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
