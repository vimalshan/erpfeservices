import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { SiteMasterListModel } from '../../../models';

@Injectable({ providedIn: 'root' })
export class SiteMasterListService {
  getSiteMasterList(): Observable<SiteMasterListModel | null> {
    // masterSiteList query is not available on the backend (port 5004)
    return of({
      data: [],
      isSuccess: true,
    } as unknown as SiteMasterListModel);
  }
}
