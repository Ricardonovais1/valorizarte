'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { Post } from '@/lib/data'
import { PostCard } from './PostCard'

const PAGE_SIZE = 9

/**
 * <select> nativo abre a lista de opções com a fonte padrão do sistema
 * operacional — o navegador ignora o CSS do site nesse popup. Um dropdown
 * próprio garante que a lista use a mesma fonte do restante do site.
 */
function CategoryDropdown({
  categories,
  value,
  onChange,
}: {
  categories: string[]
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function select(next: string) {
    onChange(next)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative w-full sm:w-64">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-[5px] border border-slate-200 bg-white py-2.5 pl-4 pr-3.5 text-left text-sm text-navy shadow-sm transition focus:border-teal focus:outline-none"
      >
        <span className="truncate">{value || 'Todas as categorias'}</span>
        <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 max-h-72 w-full overflow-auto rounded-[5px] border border-slate-200 bg-white py-1.5 shadow-lg"
        >
          <li role="option" aria-selected={!value}>
            <button
              type="button"
              onClick={() => select('')}
              className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-slate-50 ${
                !value ? 'font-semibold text-teal-dark' : 'text-navy'
              }`}
            >
              Todas as categorias
            </button>
          </li>
          {categories.map((c) => (
            <li key={c} role="option" aria-selected={value === c}>
              <button
                type="button"
                onClick={() => select(c)}
                className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-slate-50 ${
                  value === c ? 'font-semibold text-teal-dark' : 'text-navy'
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function BlogList({ posts }: { posts: Post[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const post of posts) if (post.categoryTitle) set.add(post.categoryTitle)
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [posts])

  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesCategory = !category || post.categoryTitle === category
      const matchesSearch =
        !term || post.title.toLowerCase().includes(term) || (post.excerpt ?? '').toLowerCase().includes(term)
      return matchesCategory && matchesSearch
    })
  }, [posts, category, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryDropdown
          categories={categories}
          value={category}
          onChange={(next) => {
            setCategory(next)
            setPage(1)
          }}
        />

        <div className="relative w-full sm:w-72">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Buscar no blog..."
            className="w-full rounded-[5px] border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-navy shadow-sm transition focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      {pageItems.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500">Nenhum post encontrado.</p>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginação" className="mt-16 flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-[5px] text-navy transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-current={n === currentPage ? 'page' : undefined}
              onClick={() => setPage(n)}
              className={`flex h-9 w-9 items-center justify-center rounded-[5px] text-sm font-medium transition ${
                n === currentPage ? 'bg-navy text-white' : 'text-navy hover:bg-slate-100'
              }`}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            aria-label="Próxima página"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-[5px] text-navy transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      )}
    </div>
  )
}
