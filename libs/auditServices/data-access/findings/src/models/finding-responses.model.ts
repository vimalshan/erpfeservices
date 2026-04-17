import { FindingResponsesFormModel } from './finding-responses-form.model';

export interface FindingResponsesModel {
  isSubmit: boolean;
  formValue: FindingResponsesFormModel;
  isDraft?: boolean;
  respondId?: string;
  createdOn?: string;
}
