'use client'
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function Checkbox({ label, ...rest }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" className="size-4 accent-[var(--gp-dark)]" {...rest} />
      <span>{label}</span>
    </label>
  )
}
