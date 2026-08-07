'use client'

import Link from 'next/link'
import { useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, ChevronDown } from 'lucide-react'
import type { NavItem } from './HeaderBar'

const noopSubscribe = () => () => {}

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  // O <header> usa backdrop-blur, que cria um containing block para
  // descendentes fixed — o painel ficava espremido na altura do header em
  // vez de cobrir a tela. Um portal para o body escapa desse containing
  // block. Só renderiza após montar porque document.body não existe no SSR.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

  const menu = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col overflow-y-auto bg-navy text-white"
          >
            <div className="flex items-center justify-end p-4">
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-[5px]"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col px-6 pb-8">
              {items.map((item) => (
                <div key={item.label} className="border-b border-white/10 py-3">
                  <div className="flex items-center justify-between">
                    <Link href={item.href} onClick={() => setOpen(false)} className="text-base font-medium">
                      {item.label}
                    </Link>
                    {item.children && item.children.length > 0 && (
                      <button
                        type="button"
                        aria-label={`Expandir ${item.label}`}
                        onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                        className="p-2"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${expanded === item.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>
                  <AnimatePresence initial={false}>
                    {item.children && expanded === item.label && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4"
                      >
                        {item.children.map((child) => (
                          <li key={child.href} className="py-2">
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="text-sm text-white/80 hover:text-teal"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Link
                href="/#newsletter"
                onClick={() => setOpen(false)}
                className="mt-6 inline-block rounded-[5px] bg-gold px-8 py-3 text-center text-sm font-medium text-white"
              >
                Fale conosco
              </Link>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-[5px] text-navy"
      >
        <Menu size={24} />
      </button>

      {mounted && createPortal(menu, document.body)}
    </div>
  )
}
