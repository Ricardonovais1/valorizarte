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
  if (variant === 'plain') {
    return (
      <Link href={`/empresas/${service.slug}`} className="group flex flex-col">
        <h3
          className={`font-semibold ${size === 'lg' ? 'text-2xl' : 'text-lg'} ${dark ? 'text-white' : 'text-navy'}`}
        >
          {service.title}
        </h3>
        {service.summary && (
          <p
            className={`mt-2 leading-relaxed ${size === 'lg' ? 'text-base' : 'text-sm'} ${
              dark ? 'text-white/70' : 'text-slate-600'
            }`}
          >
            {service.summary}
          </p>
        )}
        <span
          className={`mt-3 font-medium text-teal transition group-hover:text-teal-dark ${
            size === 'lg' ? 'text-base' : 'text-sm'
          }`}
        >
          Saiba mais
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={`/empresas/${service.slug}`}
      className="group flex flex-col rounded-[3px] bg-navy p-6 transition hover:brightness-110"
    >
      <h3 className="text-base font-semibold text-white">{service.title}</h3>
      {service.summary && <p className="mt-2 text-sm text-white/70">{service.summary}</p>}
      <span className="mt-4 text-sm font-medium text-teal">Saiba mais →</span>
    </Link>
  )
}
