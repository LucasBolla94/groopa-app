'use client'
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { List } from 'lucide-react'
import Link from 'next/link'

interface ListDoc {
  id: string
  name: string
  visibility: boolean
  dateStart?: string
  dateFinish?: string
  currency?: string
}

export default function ListsOverview() {
  const [lists, setLists] = useState<ListDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (!currentUser) return

      // Buscar listas onde o user é dono
      const ownedQuery = query(collection(db, 'list'), where('uid', '==', currentUser.uid))
      const ownedSnap = await getDocs(ownedQuery)

      // Buscar listas onde o user é membro
      const memberQuery = query(
        collection(db, 'list'),
        where('members', 'array-contains', currentUser.uid)
      )
      const memberSnap = await getDocs(memberQuery)

      const allDocs = [...ownedSnap.docs, ...memberSnap.docs]

      const combined: ListDoc[] = []
      const seen = new Set()

      for (const doc of allDocs) {
        if (!seen.has(doc.id)) {
          seen.add(doc.id)
          combined.push({ id: doc.id, ...(doc.data() as Omit<ListDoc, 'id'>) })
        }
      }

      setLists(combined)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <p className="mt-6 text-sm text-[var(--gp-dark)]/70">Loading lists…</p>
  }

  return (
    <section className="mt-10">
      <h3 className="text-lg font-bold text-[var(--gp-dark)] mb-4">Your Lists</h3>

      {lists.length === 0 ? (
        <p className="text-sm text-[var(--gp-dark)]/70">You don’t have any lists yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map(list => (
            <Link
              key={list.id}
              href={`/dash/lists/${list.id}`}
              className="bg-[var(--gp-white)] p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-2 text-[var(--gp-dark)]">
                <List className="w-5 h-5" />
                <h4 className="font-semibold text-base">{list.name}</h4>
              </div>
              <p className="text-sm text-[var(--gp-dark)]/70">
                {list.visibility ? 'Public' : 'Private'} • {list.currency ?? '—'}
              </p>
              {list.dateStart && (
                <p className="text-xs text-[var(--gp-dark)]/50 mt-1">
                  {`Start: ${list.dateStart}`}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
