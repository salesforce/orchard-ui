'use client'

import ResourceTable from '@/components/OldResourceTable';

export default function ResourcesPage({ params }) {

  return <ResourceTable workflowId={params.id} />

}
