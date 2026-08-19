import { Reveal } from './Reveal'

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
    <Reveal className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p
          className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-widest ${
            dark ? 'text-teal' : 'text-teal-deep'
          }`}
        >
          <span className={`h-px w-6 ${dark ? 'bg-teal/60' : 'bg-teal-dark/40'}`} aria-hidden="true" />
          {eyebrow}
          <span className={`h-px w-6 ${dark ? 'bg-teal/60' : 'bg-teal-dark/40'}`} aria-hidden="true" />
        </p>
      )}
      <h2 className={`mt-2 text-2xl font-bold sm:text-3xl ${dark ? 'text-white' : 'text-navy'}`}>{title}</h2>
      {description && <p className={`mt-3 ${dark ? 'text-white/70' : 'text-slate-600'}`}>{description}</p>}
    </Reveal>
  )
}
