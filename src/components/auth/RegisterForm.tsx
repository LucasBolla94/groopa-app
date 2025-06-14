'use client'
import { FormEvent, useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import Input from './Input'
import Checkbox from './Checkbox'
import { useRouter } from 'next/navigation'

type Err = { firstName?: string; lastName?: string; email?: string; password?: string; terms?: string }

export default function RegisterForm() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Err>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [success, setSuccess] = useState(false)

  /* ---------- validators ---------- */
  const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const validateAll = (data: FormData): Err => {
    const err: Err = {}
    if (!(data.get('firstName') as string)?.trim()) err.firstName = 'Required'
    if (!(data.get('lastName') as string)?.trim())  err.lastName  = 'Required'
    const email = data.get('email') as string
    if (!isEmail(email)) err.email = 'Invalid email'
    const pass = data.get('password') as string
    if (pass.length < 6) err.password = 'Minimum 6 characters'
    if (!data.get('terms')) err.terms = 'You must accept the terms'
    return err
  }

  /* ---------- handle live validation ---------- */
  const onChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
    const data = new FormData(e.currentTarget)
    setErrors(filterTouched(validateAll(data)))
  }
  const filterTouched = (err: Err): Err =>
    Object.fromEntries(Object.entries(err).filter(([k]) => touched[k]))

  /* ---------- submit ---------- */
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const errs = validateAll(data)
    setErrors(errs)
    setTouched({ firstName: true, lastName: true, email: true, password: true, terms: true })
    if (Object.keys(errs).length) return

    setLoading(true)
    try {
      // 1️⃣  Firebase Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        data.get('email') as string,
        data.get('password') as string
      )

      // 2️⃣  Firestore: users/{uid}
      await setDoc(doc(collection(db, 'users'), cred.user.uid), {
        firstName: data.get('firstName'),
        lastName:  data.get('lastName'),
        email:     data.get('email'),
        createdAt: serverTimestamp(),
      })

      // Toast & redirect
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch (err: any) {
      setErrors({ email: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* form card */}
      <form
        onSubmit={onSubmit}
        onChange={onChange}
        className="w-full max-w-md bg-[var(--gp-white)] rounded-2xl shadow-lg p-6 flex flex-col gap-4"
      >
        <Input name="firstName" label="First Name" error={errors.firstName} />
        <Input name="lastName"  label="Last Name"  error={errors.lastName}  />
        <Input name="email"     label="Email" type="email" error={errors.email} />
        <Input name="password"  label="Password" type="password" error={errors.password} />

        <div className="flex flex-col gap-1">
          <Checkbox name="terms" label="I accept the Terms of Service" />
          {errors.terms && <span className="text-xs text-red-600">{errors.terms}</span>}
        </div>

        <button
          disabled={loading || Object.keys(errors).length > 0}
          className="rounded-full bg-gradient-to-r from-[var(--gp-dark)] to-[var(--gp-light)]
                     text-[var(--gp-white)] py-2 font-semibold
                     hover:from-[var(--gp-light)] hover:to-[var(--gp-dark)] hover:text-[var(--gp-dark)]
                     transition disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create Account'}
        </button>
      </form>

      {/* success toast */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-[var(--gp-light)] text-[var(--gp-dark)] px-6 py-4 rounded-xl shadow-xl animate-scale">
            Account created successfully, enjoy!
          </div>
        </div>
      )}
    </>
  )
}
