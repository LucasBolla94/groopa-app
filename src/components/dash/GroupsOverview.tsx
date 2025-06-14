'use client'
export default function GroupsOverview() {
  return (
    <section className="mt-10">
      <h3 className="text-lg font-bold text-[var(--gp-dark)] mb-4">
        Your Groups
      </h3>
      <p className="text-sm text-[var(--gp-dark)]/70">
        You’re not part of any groups yet.
      </p>
      {/* TODO: map user groups here */}
    </section>
  )
}
