type IconProps = { size?: number; className?: string }

export function FacebookIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  )
}

export function InstagramIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function LinkedinIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6.94 8.5H3.56V20.5H6.94V8.5ZM5.25 3.5A1.94 1.94 0 1 0 5.25 7.38 1.94 1.94 0 0 0 5.25 3.5ZM20.44 20.5H17.06V14.34C17.06 12.87 17.03 10.98 15 10.98C12.93 10.98 12.62 12.58 12.62 14.23V20.5H9.25V8.5H12.5V10H12.54C12.99 9.15 14.09 8.25 15.73 8.25C19.15 8.25 20.44 10.5 20.44 13.94V20.5Z" />
    </svg>
  )
}
