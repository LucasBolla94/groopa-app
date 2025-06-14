'use client'
import ActionCard from './ActionCard'

export default function QuickCreate() {
  return (
    <section className="mt-6">
      <h3 className="text-lg font-bold text-[var(--gp-dark)] mb-4">
        Quick Create
      </h3>

      {/* Mobile scroll, desktop grid */}
      <div
        className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3
                   [scrollbar-width:none] [-ms-overflow-style:none]"
      >
        <div className="sm:contents min-w-[80%] sm:min-w-0">
          <ActionCard
            href="/lists/new?type=private"
            title="Private List"
            desc="Only visible to you."
            icon="🛒"
          />
        </div>
        <div className="sm:contents min-w-[80%] sm:min-w-0">
          <ActionCard
            href="/lists/new?type=public"
            title="Public List"
            desc="Share via link."
            icon="🌍"
          />
        </div>
        <div className="sm:contents min-w-[80%] sm:min-w-0">
          <ActionCard
            href="/lists/new?type=group"
            title="Group List"
            desc="Attach to an existing group."
            icon="👥"
          />
        </div>
        <div className="sm:contents min-w-[80%] sm:min-w-0">
          <ActionCard
            href="/groups/new"
            title="Create Group"
            desc="Invite friends or family."
            icon="➕"
          />
        </div>
        <div className="sm:contents min-w-[80%] sm:min-w-0">
          <ActionCard
            href="/groups/manage"
            title="Manage Groups"
            desc="Edit or delete groups."
            icon="🛠️"
          />
        </div>
      </div>
    </section>
  )
}
