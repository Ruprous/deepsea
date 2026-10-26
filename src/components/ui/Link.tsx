import type { ComponentProps, MouseEvent } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { reduceMotion } from '../../utils/motion'
import { cover } from '../../utils/wipe'

/**
 * react-router の Link の代わり。サイト内を移動する時だけ、青い帯のワイプで画面を覆ってから遷移する。
 * 別タブで開く・修飾キー付きクリック・同じページへのリンクは、ふつうの Link と同じ動き。
 */
export default function Link({ to, state, replace, onClick, ...rest }: ComponentProps<typeof RouterLink>) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    const plain = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
    const sameTab = !rest.target || rest.target === '_self'
    const dest = typeof to === 'string' ? to : to.pathname ?? ''
    const samePage = dest.split(/[?#]/)[0] === pathname
    if (e.defaultPrevented || !plain || !sameTab || rest.reloadDocument || samePage || reduceMotion()) return

    e.preventDefault()
    cover().then(ok => { if (ok) navigate(to, { state, replace }) })
  }

  return <RouterLink to={to} state={state} replace={replace} onClick={handleClick} {...rest} />
}
