import { BaseApolloResponse, ServiceDetailsMaster } from "../../../../shared/src";


export interface ServiceMasterListModel
  extends BaseApolloResponse<ServiceMasterListItemModel[]> {
  data: ServiceDetailsMaster[];
}

export interface ServiceMasterListItemModel {
  id: number;
  serviceName: string;
}
