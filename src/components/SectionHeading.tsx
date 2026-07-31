export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow?: string
  title: string
  description?: string
  dark?: boolean
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className={`text-xs font-semibold uppercase tracking-widest ${dark ? 'text-teal' : 'text-teal-dark'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`mt-2 text-2xl font-bold sm:text-3xl ${dark ? 'text-white' : 'text-navy'}`}>{title}</h2>
      {description && <p className={`mt-3 ${dark ? 'text-white/70' : 'text-slate-600'}`}>{description}</p>}
    </div>
  )
}
