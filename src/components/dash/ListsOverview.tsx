'use client'
export default function ListsOverview() {
  return (
    <section className="mt-10">
      <h3 className="text-lg font-bold text-[var(--gp-dark)] mb-4">
        Your Lists
      </h3>
      <p className="text-sm text-[var(--gp-dark)]/70">
        You don’t have any lists yet.
      </p>
      {/* TODO: map user lists here */}
    </section>
  )
}
