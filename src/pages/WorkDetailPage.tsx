import { useParams } from 'react-router-dom'
import DetailPage from './DetailPage'

export default function WorkDetailPage() {
  const { id } = useParams<{ id: string }>()
  return <DetailPage kind="work" id={id} />
}
