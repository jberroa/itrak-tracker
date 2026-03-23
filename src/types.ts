export interface Module {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  steps: string[];
}

export interface Hospital {
  id: string;
  name: string;
  divisionId: string;
}

export interface Division {
  id: string;
  name: string;
}

export interface RolloutProgress {
  hospitalId: string;
  moduleId: string;
  completedSteps: number; // For backward compatibility or overall count
  stepStatus: boolean[]; // Array of completion status for each step
  stepCompletionDates: (string | null)[]; // Array of dates for each step
  stepComments: string[]; // Array of comments for each step
  stepResponsibleParty: string[]; // One per step: "HCA Unit Manager" | "HCA Division Leader" | "ITRAK Team"
  currentTaskIndex: number | null; // 0-11 or null (which step is "in progress")
  lastUpdated: string;
}
