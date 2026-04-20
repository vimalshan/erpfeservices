export interface ActionFilterResponseDto {
  data: ActionFilterDto[];
}

export interface ActionFilterDto {
  id: number;
  name: string;
}

export interface ActionSitesFilterDto {
  data: ActionSiteDto[];
}

export interface ActionSiteDto {
  id: number;
  name: string;
}
