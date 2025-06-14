'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import QuickCreate from './QuickCreate'
import ListsOverview from './ListsOverview'
import GroupsOverview from './GroupsOverview'

interface Profile {
  firstName: string
  lastName: string
  email: string
}

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)

  /* fetch user profile */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      if (!u) return
      const snap = await getDoc(doc(db, 'users', u.uid))
      if (snap.exists()) {
        const { firstName, lastName, email } = snap.data() as Profile
        setProfile({ firstName, lastName, email })
      }
    })
    return () => unsub()
  }, [])

  if (!profile) return <p className="p-6">Loading…</p>

  return (
    <section className="p-6">
      {/* greeting */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--gp-dark)]">
          Welcome, {profile.firstName}!
        </h2>
        <p className="text-sm text-[var(--gp-dark)]/80">{profile.email}</p>
      </div>

      {/* quick-create grid */}
      <QuickCreate />

      {/* existing content */}
      <ListsOverview />
      <GroupsOverview />
    </section>
  )
}
