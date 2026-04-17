import { SharedSelectMultipleDatum } from '@erp-services/shared';

export interface NotificationFilter {
  id: string;
  key: string;
  options: SharedSelectMultipleDatum<string>[];
  placeholderKey: string;
  selected: string[];
}
