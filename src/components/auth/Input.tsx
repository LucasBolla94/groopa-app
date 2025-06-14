'use client'
import { HTMLInputTypeAttribute } from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  type?: HTMLInputTypeAttribute
  error?: string | null
}

export default function Input({ label, type = 'text', error, ...rest }: Props) {
  return (
    <label className="flex flex-col gap-1 w-full">
      <span className="text-sm font-medium text-[var(--gp-dark)]">{label}</span>

      <input
        type={type}
        className={`rounded-lg px-4 py-2 border transition
          ${error ? 'border-red-500 focus:ring-red-500'
                  : 'border-[var(--gp-light)] focus:ring-[var(--gp-dark)]'}
          focus:outline-none focus:ring-2`}
        {...rest}
      />

      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
}
