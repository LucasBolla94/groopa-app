'use client'

import {
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import {
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Lock,
  Unlock,
  Settings,
  Loader,
} from 'lucide-react'

interface ListDoc {
  id: string
  uid: string
  name: string
  description?: string
  visibility: boolean
  allowContributions?: boolean
  publicPassword?: string
  currency?: string
}

interface ItemDoc {
  id: string
  name: string
  qty?: number
  price?: number
  picked?: boolean
  notes?: string
  photoUrl?: string
}

export default function ListOwnerPage({
  params,
}: {
  params: { idlist: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<ListDoc | null>(null)
  const [items, setItems] = useState<ItemDoc[]>([])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, u => setUser(u))
    return () => unsubAuth()
  }, [])

  useEffect(() => {
    if (!user) return

    const listRef = doc(db, 'list', params.idlist)
    const unsubList = onSnapshot(listRef, snap => {
      if (!snap.exists()) {
        router.replace('/dash')
        return
      }
      const listData = snap.data()
      const data: ListDoc = {
        id: snap.id,
        uid: listData.uid,
        name: listData.name,
        description: listData.description,
        visibility: listData.visibility,
        allowContributions: listData.allowContributions,
        publicPassword: listData.publicPassword,
        currency: listData.currency,
      }

      if (data.uid !== user.uid) {
        router.replace('/dash')
        return
      }

      setList(data)
      setLoading(false)
    })

    const itemsRef = query(
      collection(db, 'list', params.idlist, 'items'),
      orderBy('createdAt', 'asc')
    )
    const unsubItems = onSnapshot(itemsRef, snap => {
      const arr: ItemDoc[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<ItemDoc, 'id'>),
      }))
      setItems(arr)
    })

    return () => {
      unsubList()
      unsubItems()
    }
  }, [user, params.idlist, router])

  async function addItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = (form.get('itemName') as string).trim()
    if (!name) return
    await addDoc(collection(db, 'list', params.idlist, 'items'), {
      name,
      qty: Number(form.get('qty') || 1),
      price: Number(form.get('price') || 0),
      picked: false,
      createdAt: serverTimestamp(),
    })
    e.currentTarget.reset()
  }

  async function togglePicked(item: ItemDoc) {
    await updateDoc(
      doc(db, 'list', params.idlist, 'items', item.id),
      { picked: !item.picked }
    )
  }

  async function deleteItem(id: string) {
    await deleteDoc(doc(db, 'list', params.idlist, 'items', id))
  }

  async function toggleVisibility() {
    if (!list) return
    await updateDoc(doc(db, 'list', list.id), { visibility: !list.visibility })
  }

  async function toggleContrib() {
    if (!list) return
    await updateDoc(doc(db, 'list', list.id), {
      allowContributions: !list.allowContributions,
    })
  }

  async function deleteList() {
    if (!list) return
    if (confirm('Delete this list permanently?')) {
      await deleteDoc(doc(db, 'list', list.id))
      router.push('/dash')
    }
  }

  if (loading || !list) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    )
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-8">
      <header className="bg-[var(--gp-light)] p-6 rounded-2xl shadow space-y-2">
        <h1 className="text-2xl font-bold text-[var(--gp-dark)]">{list.name}</h1>
        {list.description && (
          <p className="text-sm text-[var(--gp-dark)]/80">{list.description}</p>
        )}
        <div className="flex flex-wrap gap-3 pt-4 text-sm">
          <button
            onClick={toggleVisibility}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--gp-dark)] text-[var(--gp-white)]"
          >
            {list.visibility ? <Unlock size={14} /> : <Lock size={14} />}
            {list.visibility ? 'Public' : 'Private'}
          </button>
          <button
            onClick={toggleContrib}
            className="flex items-center gap-1 px-3 py-1 rounded-full border border-[var(--gp-dark)] text-[var(--gp-dark)]"
          >
            <Settings size={14} />
            {list.allowContributions ? 'Contrib ON' : 'Contrib OFF'}
          </button>
          <button
            onClick={deleteList}
            className="ml-auto flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </header>

      <section className="bg-[var(--gp-white)] p-4 rounded-xl shadow space-y-4">
        <form onSubmit={addItem} className="flex flex-wrap gap-3">
          <input
            name="itemName"
            placeholder="Item name"
            required
            className="flex-1 min-w-[140px] rounded-lg border border-[var(--gp-dark)]/30 p-2"
          />
          <input
            name="qty"
            type="number"
            min={1}
            defaultValue={1}
            className="w-20 rounded-lg border border-[var(--gp-dark)]/30 p-2"
            placeholder="Qty"
          />
          <input
            name="price"
            type="number"
            step="0.01"
            className="w-24 rounded-lg border border-[var(--gp-dark)]/30 p-2"
            placeholder="Price"
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-[var(--gp-dark)] text-[var(--gp-white)] px-4 rounded-full"
          >
            <Plus size={16} /> Add
          </button>
        </form>

        {items.length === 0 ? (
          <p className="text-sm text-[var(--gp-dark)]/60">No items yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map(it => (
              <li
                key={it.id}
                className="flex items-start gap-3 bg-[var(--gp-light)] p-3 rounded-lg"
              >
                <button onClick={() => togglePicked(it)}>
                  {it.picked ? (
                    <CheckSquare className="text-[var(--gp-dark)]" />
                  ) : (
                    <Square className="text-[var(--gp-dark)]" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={`font-medium ${it.picked ? 'line-through text-[var(--gp-dark)]/50' : ''}`}>
                    {it.name}{' '}
                    {it.qty && (
                      <span className="text-xs text-[var(--gp-dark)]/60">× {it.qty}</span>
                    )}
                  </p>
                  {it.price ? (
                    <p className="text-xs text-[var(--gp-dark)]/70">
                      {list.currency} {it.price.toFixed(2)}
                    </p>
                  ) : null}
                  {it.notes && (
                    <p className="text-xs text-[var(--gp-dark)]/50">{it.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteItem(it.id)}
                  aria-label="delete item"
                  className="text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
