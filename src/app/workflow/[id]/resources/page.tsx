'use client'

import ResourceTable from '@/components/ResourceTable';

export default function ResourcesPage({ params }) {

  return <ResourceTable workflowId={params.id} />

}
