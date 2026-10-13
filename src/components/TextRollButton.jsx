// Text-roll button (specs/products.md §1.4E): 52px frame with 4px padding around an inner block.
// The label is rendered twice, the copy 30px below, clipped; on hover both roll up 30px
// (.text-roll / .text-roll-track in index.css: 0.25s cubic-bezier(.3,1.4,.5,1), 1px overshoot).
//
// props:
//   label, href            text and target (omit href with as="span" inside another link)
//   as                     'a' (default) or 'span'
//   frame                  classes for the outer frame (default bg-card-dark)
//   fill                   classes for the inner block: background + text colour
//   pad                    inner side padding (default px-6)
//   className              extra classes on the outer frame (width etc.)
//   trigger                'self' (default): rolls when the button is hovered (.text-roll);
//                          'group': rolls with a fade when the enclosing .group is hovered (blog cards);
//                          'none': static (featured post and case-study cards: no roll on the live site)
export default function TextRollButton({
  label,
  href,
  as: Tag = 'a',
  frame = 'bg-card-dark',
  fill = 'bg-card-dark text-cream',
  pad = 'px-6',
  className = '',
  trigger = 'self',
  ...rest
}) {
  const host = trigger === 'self' ? 'text-roll' : trigger === 'group' ? 'text-roll-group' : ''
  return (
    <Tag href={Tag === 'a' ? href : undefined} className={`${host} flex h-[52px] p-1 ${frame} ${className}`} {...rest}>
      <span className={`flex h-[44px] w-full items-center justify-center py-[10px] ${pad} ${fill}`}>
        <span className="t-btn relative block h-6 overflow-hidden">
          <span className="text-roll-track relative block">
            <span className="roll-a block whitespace-nowrap">{label}</span>
            <span className="roll-b absolute left-0 top-[30px] block whitespace-nowrap" aria-hidden="true">
              {label}
            </span>
          </span>
        </span>
      </span>
    </Tag>
  )
}
