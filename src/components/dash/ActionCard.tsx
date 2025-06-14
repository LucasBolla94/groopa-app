'use client'
import React from 'react'
import Link from 'next/link'

interface Props {
  href: string
  title: string
  desc: string
  icon: React.ReactNode
}

export default function ActionCard({ href, title, desc, icon }: Props) {
  return (
    <Link
      href={href}
      className="flex flex-col justify-between gap-3 bg-[var(--gp-light)] rounded-2xl p-5
                 shadow-md border border-[var(--gp-dark)]/5
                 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out
                 min-h-[160px]"
    >
      {/* Ícone */}
      <div className="text-4xl">{icon}</div>

      {/* Título */}
      <h3 className="text-lg font-semibold text-[var(--gp-dark)]">{title}</h3>

      {/* Descrição */}
      <p className="text-sm text-[var(--gp-dark)]/80">{desc}</p>
    </Link>
  )
}
