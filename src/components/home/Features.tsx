import { ListChecks, Users, Cloud } from 'lucide-react'

const features = [
  {
    icon: ListChecks,
    title: 'Real-time Sync',
    description: 'Tick items off and everyone sees updates instantly — no refresh required.',
  },
  {
    icon: Users,
    title: 'Invite & Share',
    description: 'Add housemates or friends with a link; set roles for viewers or editors.',
  },
  {
    icon: Cloud,
    title: 'Offline-first & Cloud Backup',
    description: 'Keep shopping when signal drops — changes sync once you’re back online.',
  },
]

export default function Features() {
  return (
    <section className="py-16 px-6 bg-[var(--gp-light)]/40">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-[var(--gp-dark)]">
        Why Teams Love Groopa
      </h2>

      <div className="grid gap-10 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center text-center md:items-start md:text-left">
            <Icon className="size-10 mb-4 text-[var(--gp-dark)]" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-[var(--gp-black)]/80">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
