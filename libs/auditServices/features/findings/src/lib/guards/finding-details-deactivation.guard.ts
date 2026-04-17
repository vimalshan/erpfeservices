/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, of, switchMap, take } from 'rxjs';
import { FindingDetailsComponent } from '../components';

export const findingDetailsDeactivationGuard: CanDeactivateFn<
  FindingDetailsComponent
> = (
  component: FindingDetailsComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot,
): Observable<boolean> => {
  const ts = inject(TranslocoService);

  return component.isFindingResponseFormDirty$.pipe(
    take(1),
    switchMap((isDirty) => {
      if (!isDirty) {
        return of(true);
      }

      return new Observable<boolean>((observer) => {
        component.confirmationService.confirm({
          header: ts.translate('findings.discardDraftPopup.discardDraftHeader'),
          message: ts.translate(
            'findings.discardDraftPopup.discardDraftMessage',
          ),
          accept: () => {
            observer.next(false);
            observer.complete();
          },
          reject: () => {
            observer.next(true);
            observer.complete();
          },
          acceptLabel: ts.translate(
            'findings.discardDraftPopup.continueEditing',
          ),
          rejectLabel: ts.translate('findings.discardDraftPopup.discard'),
          acceptIcon: 'null',
          rejectIcon: 'null',
          acceptButtonStyleClass: 'accept-button',
          rejectButtonStyleClass: 'reject-button',
        });
      });
    }),
  );
};
