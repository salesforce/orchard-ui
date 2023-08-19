export interface Activity {
  workflowId: string,
  activityId: string,
  name: string,
  activityType: string,
  activitySpec: any,
  resourceId: string,
  maxAttempt: number,
  status: string,
  createdAt: string,
  activatedAt: string,
  terminatedAt: string
}

export interface ActivityAttempt {
  workflowId: string,
  activityId: string,
  attempt: number,
  status: string,
  errorMessage: string,
  resourceId: string,
  resourceInstanceAttempt: number,
  attemptSpec: any,
  createdAt: string,
  activatedAt: string,
  terminatedAt: string
}

export interface ResourceInstance {
  workflowId: string,
  resourceId: string,
  instanceAttempt: number,
  instanceSpec: any,
  status: string,
  errorMessage: string,
  createdAt: string,
  activatedAt: string,
  terminatedAt: string
}

export interface Resource {
  workflowId: string,
  resourceId: string,
  name: string,
  resourceType: string,
  resourceSpec: any,
  maxAttempt: number,
  status: string,
  createdAt: string,
  activatedAt: string,
  terminatedAt: string,
  terminateAfter: number
}
