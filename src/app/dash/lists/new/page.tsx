// Rota: https://groopa.online/dash/lists/new?type=private
import ListForm from '@/components/dash/lists/ListForm'

interface Props {
  searchParams: { type?: string }
}

export default function NewListPage({ searchParams }: Props) {
  const type = searchParams.type === 'public' ? 'public' : 'private'
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-xl font-bold text-[var(--gp-dark)] mb-4">
        {type === 'public' ? 'Create Public List' : 'Create Private List'}
      </h1>
      <ListForm defaultType={type} />
    </main>
  )
}
