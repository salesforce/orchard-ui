import { BasicTable } from '@/components/WorkflowTable'

export default function Worfklows({ params }) {
  return <BasicTable statuses={[params.status]} />
}
