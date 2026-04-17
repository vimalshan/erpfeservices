import { Selector } from '@ngxs/store';

import { DocumentsState, DocumentsStateModel } from '../state/documents.state';

export class DocumentsSelectors {
  @Selector([DocumentsState])
  static canUploadData(state: DocumentsStateModel): boolean {
    return state.canUploadData;
  }
}
