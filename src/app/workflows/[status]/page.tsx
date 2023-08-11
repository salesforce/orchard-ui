import WorkflowTable from "@/components/OldWorkflowTable";

export default function Worfklows({ params }) {
  return <WorkflowTable statuses={[params.status]} search={'%'} />
}
