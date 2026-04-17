export interface ActionFilterResponseDto {
  data: ActionFilterDto[];
  isSuccess: boolean;
}

export interface ActionFilterDto {
  id: number;
  label: string;
}

export interface ActionSitesFilterDto {
  data: ActionSiteDto[];
  isSuccess: boolean;
}

export interface ActionSiteDto {
  id: number;
  label: string;
  children: ActionSiteDto[];
}
