import { BaseApolloResponse, ServiceDetailsMaster } from "../../../../shared/src";


export interface ServiceMasterListModel
  extends BaseApolloResponse<ServiceMasterListItemModel[]> {
  data: ServiceDetailsMaster[];
  isSuccess: boolean;
  message?: string;
}

export interface ServiceMasterListItemModel {
  id: number;
  serviceName: string;
}
