'use client'

import ActivityTable from '@/components/ActivityTable';

export default function WorkflowPage({ params }) {
  return <ActivityTable workflowId={params.id} />
}
