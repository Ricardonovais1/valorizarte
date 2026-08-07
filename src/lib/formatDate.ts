export function formatInterviewDate(value?: string): string | undefined {
  if (!value) return undefined
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
