export interface ManageFindingDetailsDto {
  data: ManageFindingDetailsItemDto;
  isSuccess: boolean;
}

export interface ManageFindingDetailsItemDto {
  category: string;
  clauses: string[];
  descriptionInPrimaryLanguage: string;
  descriptionInSecondaryLanguage: string;
  primaryLanguage: string;
  secondaryLanguage: string;
  titleInPrimaryLanguage: string;
  titleInSecondaryLanguage: string;
  focusAreas: FocusAreaDto[];
}

export interface FocusAreaDto {
  focusAreaInPrimaryLanguage: string;
  focusAreaInSecondaryLanguage: string;
}
