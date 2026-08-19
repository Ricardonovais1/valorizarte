import Link from 'next/link'
import type { Service } from '@/lib/data'

export function ServiceCard({
  service,
  variant = 'card',
  dark = false,
  size = 'md',
}: {
  service: Service
  variant?: 'card' | 'plain'
  dark?: boolean
  size?: 'md' | 'lg'
}) {
  const blurb = service.cardSummary || service.summary

  if (variant === 'plain') {
    return (
      <Link href={`/empresas/${service.slug}`} className="group flex flex-col">
        <h3
          className={`font-semibold ${size === 'lg' ? 'text-2xl' : 'text-lg'} ${dark ? 'text-white' : 'text-navy'}`}
        >
          {service.title}
        </h3>
        {blurb && (
          <p
            className={`mt-2 leading-relaxed ${size === 'lg' ? 'text-base' : 'text-sm'} ${
              dark ? 'text-white/70' : 'text-slate-600'
            }`}
          >
            {blurb}
          </p>
        )}
        <span
          className={`mt-3 inline-flex items-center gap-1 font-medium transition group-hover:text-teal-dark ${
            dark ? 'text-teal' : 'text-teal-deep'
          } ${size === 'lg' ? 'text-base' : 'text-sm'}`}
        >
          Saiba mais
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={`/empresas/${service.slug}`}
      className="card-lift group flex flex-col rounded-[3px] bg-navy p-6 hover:bg-navy-deep"
    >
      <h3 className="text-base font-semibold text-white">{service.title}</h3>
      {blurb && <p className="mt-2 text-sm text-white/70">{blurb}</p>}
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal transition group-hover:text-teal-dark">
        Saiba mais
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  )
}
