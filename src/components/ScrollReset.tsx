import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/** ページ遷移（リンクで進んだ時）は先頭にスクロール。戻る/進むはブラウザの復元に任せる */
export default function ScrollReset() {
  const { pathname } = useLocation()
  const type = useNavigationType()

  useEffect(() => {
    if (type !== 'POP') window.scrollTo(0, 0)
  }, [pathname, type])

  return null
}
