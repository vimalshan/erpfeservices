export interface ActionsListModel {
  actions: ActionsModel[];
}

export interface ActionsModel {
  id: number;
  actionName: string;
  dueDate: string;
  highPriority: boolean;
  message: string;
  service: string;
  site: string;
  entityType: string;
  entityId: string;
  actions: ActionDetailModel[];
  dateWithIcon: IconModel;
  iconTooltip: IconModel;
}

export interface IconModel {
  displayIcon: boolean;
  iconClass: string;
  tooltipMessage: string;
  iconPosition: string;
}

export interface ActionDetailModel {
  actionType: string;
  iconClass: string;
  label: string;
  url: string;
}
