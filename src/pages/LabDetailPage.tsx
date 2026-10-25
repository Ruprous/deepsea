import { useParams } from 'react-router-dom'
import DetailPage from './DetailPage'

export default function LabDetailPage() {
  const { id } = useParams<{ id: string }>()
  return <DetailPage kind="lab" id={id} />
}
