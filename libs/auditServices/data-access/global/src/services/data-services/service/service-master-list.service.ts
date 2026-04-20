import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ServiceMasterListModel } from '../../../models';

@Injectable({ providedIn: 'root' })
export class ServiceMasterListService {
  getServiceMasterList(): Observable<ServiceMasterListModel | null> {
    // masterServiceList query is not available on the backend (port 5004)
    return of({
      data: [],
      isSuccess: true,
    } as unknown as ServiceMasterListModel);
  }
}
