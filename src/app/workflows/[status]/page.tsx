import WorkflowTable from "@/components/WorkflowTable";

export default function Worfklows({ params }) {
  return <WorkflowTable statuses={[params.status]} search={'%'} />
}
