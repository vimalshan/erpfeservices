export interface ActionsFilterModel {
  id: string;
  key: string;
  options: string[];
  placeholderKey: string;
  selected: string[];
}

export interface ActionFilterModel {
  label: string;
  value: number;
}

export interface ActionFilterDataModel {
  data: ActionFilterModel[];
}

export interface ActionSitesFilterModel {
  data: ActionSiteModel[];
}

export interface ActionSiteModel {
  label: string;
  value: number;
  children: ActionSiteModel[];
}
