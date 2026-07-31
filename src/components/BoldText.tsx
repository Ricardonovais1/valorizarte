// Renderiza texto simples com suporte a **negrito** (mesma convenção leve
// usada no conteúdo semente para blocos de Portable Text).
export function BoldText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*(.+)\*\*$/)
        return bold ? <strong key={i}>{bold[1]}</strong> : <span key={i}>{part}</span>
      })}
    </>
  )
}
