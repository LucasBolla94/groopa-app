'use client'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Nav from '@/components/dash/Nav'
import Home from '@/components/dash/Home'

export default function DashPage() {
  const router = useRouter()

  /* Redirect if not authenticated */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (!user) router.replace('/auth/login')
    })
    return () => unsub()
  }, [router])

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <Home />
    </main>
  )
}
