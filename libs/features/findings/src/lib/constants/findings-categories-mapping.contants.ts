import { FindingsTagStates } from '@customer-portal/shared';

export const FINDINGS_CATEGORIES: Record<string, string> = {
  majorCount: FindingsTagStates.Cat1Major,
  minorCount: FindingsTagStates.Cat2Minor,
  observationCount: FindingsTagStates.Observation,
  toImproveCount: FindingsTagStates.OpportunityForImprovement,
};
