'use client'
import { useState, FormEvent } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

interface Props {
  defaultType: 'private' | 'public'
}

export default function ListForm({ defaultType }: Props) {
  const router = useRouter()
  const [loading, setLoading]   = useState(false)
  const [err, setErr]           = useState<string | null>(null)

  /* today's ISO string for <input type="date" min="..." /> */
  const todayISO = new Date().toISOString().split('T')[0]

  /* -------------------------------------------------- */
  /* Submit handler                                     */
  /* -------------------------------------------------- */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data   = new FormData(e.currentTarget)
    const name   = (data.get('name') as string).trim()
    const start  = data.get('start') as string
    const finish = data.get('finish') as string

    /* --- basic validations -------------------------- */
    if (!name)            return setErr('List name is required.')
    if (start && start < todayISO)
      return setErr('Start date cannot be in the past.')

    /* optional: ensure finish >= start */
    if (start && finish && finish < start)
      return setErr('End date must be after start date.')

    setLoading(true)
    setErr(null)

    try {
      const user = auth.currentUser
      if (!user) throw new Error('Not authenticated')

      /* visibility boolean: public → true, private → false */
      const isPublic = defaultType === 'public'

      await addDoc(collection(db, 'list'), {
        uid: user.uid,
        name,
        description: data.get('desc'),
        dateStart: start || null,
        dateFinish: finish || null,
        visibility: isPublic,                  // ✅ boolean
        currency: data.get('currency'),
        allowContributions: !!data.get('allow'),
        createdAt: serverTimestamp(),
      })

      router.push('/dash?created=1')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Unknown error occurred.')
    } finally {
      setLoading(false)
    }
  }

  /* -------------------------------------------------- */
  /* UI                                                 */
  /* -------------------------------------------------- */
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 max-w-xl w-full bg-[var(--gp-light)] p-6 rounded-2xl shadow-md"
    >
      {/* Details --------------------------------------------------- */}
      <fieldset className="space-y-3">
        <legend className="font-semibold text-[var(--gp-dark)] text-lg mb-1">List Details</legend>

        <div>
          <label className="block text-sm font-medium mb-1">List Name</label>
          <input
            name="name"
            maxLength={50}
            required
            placeholder="Tesco, Barbecue…"
            className="w-full rounded-lg border border-[var(--gp-dark)]/30 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--gp-dark)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="desc"
            maxLength={500}
            rows={3}
            placeholder="Optional description (max 500 chars)"
            className="w-full rounded-lg border border-[var(--gp-dark)]/30 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--gp-dark)]"
          />
        </div>
      </fieldset>

      {/* Dates & Currency ----------------------------------------- */}
      <fieldset className="space-y-3">
        <legend className="font-semibold text-[var(--gp-dark)] text-lg mb-1">Dates & Currency</legend>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="start"
              min={todayISO}                     /* ⛔ não deixa escolher ontem */
              className="w-full rounded-lg border border-[var(--gp-dark)]/30 p-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="finish"
              className="w-full rounded-lg border border-[var(--gp-dark)]/30 p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <select
            name="currency"
            className="w-full rounded-lg border border-[var(--gp-dark)]/30 p-2"
          >
            <option value="GBP">£ (British Pound)</option>
            <option value="USD">$ (US Dollar)</option>
            <option value="EUR">€ (Euro)</option>
            <option value="BRL">R$ (Brazilian Real)</option>
          </select>
        </div>
      </fieldset>

      {/* Hidden visibility (bool) */}
      <input type="hidden" name="visibility" value={defaultType} />

      {/* Contributions ------------------------------------------- */}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="allow" className="size-4 accent-[var(--gp-dark)]" />
        Allow contributions (requires a group)
      </label>

      {/* Error / status ------------------------------------------ */}
      {err && <p className="text-red-600 text-sm text-center">{err}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[var(--gp-dark)] text-[var(--gp-white)] py-2 font-semibold
                   hover:bg-[var(--gp-light)] hover:text-[var(--gp-dark)] transition disabled:opacity-50"
      >
        {loading ? 'Creating list…' : 'Create List'}
      </button>
    </form>
  )
}
