import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { reduceMotion } from '../utils/motion'
import { cover } from '../utils/wipe'

/** useNavigate の代わり。青い帯のワイプで覆ってから移動する（-1 で「戻る」も可） */
export function useWipeNavigate() {
  const navigate = useNavigate()
  return useCallback((to: string | number) => {
    const go = () => (typeof to === 'number' ? navigate(to) : navigate(to))
    if (reduceMotion()) return go()
    cover().then(ok => { if (ok) go() })
  }, [navigate])
}
