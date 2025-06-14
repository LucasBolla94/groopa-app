'use client'
import { useState } from 'react'
import Link from 'next/link'

const links = [
  { label: 'Home',    href: '/dash' },
  { label: 'Lists',   href: '/dash/lists' },
  { label: 'Groups',  href: '/dash/groups' },
  { label: 'Settings',href: '/dash/settings' },
  { label: 'Help',    href: '/dash/help' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-[var(--gp-dark)] text-[var(--gp-white)]">
      {/* desktop */}
      <ul className="hidden md:flex gap-6 px-6 py-3">
        {links.map(l => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-[var(--gp-light)] transition">{l.label}</Link>
          </li>
        ))}
      </ul>

      {/* mobile hamburger */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <span className="font-bold">Groopa.Online</span>
        <button
          aria-label="menu"
          onClick={() => setOpen(!open)}
          className="text-[var(--gp-white)] focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* mobile drawer */}
      {open && (
        <ul className="md:hidden flex flex-col gap-3 px-4 pb-4 bg-[var(--gp-dark)]">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block py-1 hover:text-[var(--gp-light)] transition"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
