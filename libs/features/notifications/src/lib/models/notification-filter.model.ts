import { SharedSelectMultipleDatum } from '@customer-portal/shared';

export interface NotificationFilter {
  id: string;
  key: string;
  options: SharedSelectMultipleDatum<string>[];
  placeholderKey: string;
  selected: string[];
}
