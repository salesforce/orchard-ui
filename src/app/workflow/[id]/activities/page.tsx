'use client'

import ActivityTable from '@/components/OldActivityTable';

export default function WorkflowPage({ params }) {
  return <ActivityTable workflowId={params.id} />
}
