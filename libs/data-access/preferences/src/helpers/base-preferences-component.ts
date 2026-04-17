import { DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions, ofActionSuccessful } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';

import { ObjectName, ObjectType, PageName } from '@customer-portal/shared';

import {
  LoadPreferenceFail,
  LoadPreferenceSuccess,
  PreferenceStoreService,
} from '../state';

export abstract class BasePreferencesComponent {
  private preferenceDataLoadedSubject = new BehaviorSubject<boolean>(false);
  private pageName!: PageName;
  private objectName!: ObjectName;
  private objectType!: ObjectType;

  protected preferenceDataLoaded =
    this.preferenceDataLoadedSubject.asObservable();
  protected preferenceStoreService = inject(PreferenceStoreService);
  protected actions$ = inject(Actions);
  protected destroyRef = inject(DestroyRef);
  protected preferenceData: Signal<any> = this.getPreferenceData();

  constructor() {
    this.handlePreferenceActions();
  }

  protected initializePreferences(
    pageName: PageName,
    objectName: ObjectName,
    objectType: ObjectType,
  ) {
    this.pageName = pageName;
    this.objectName = objectName;
    this.objectType = objectType;

    this.preferenceStoreService.loadPreference(
      pageName,
      objectName,
      objectType,
    );
  }

  protected savePreferences(data: any) {
    this.preferenceStoreService.savePreference({
      pageName: this.pageName,
      objectName: this.objectName,
      objectType: this.objectType,
      data,
    });
  }

  private handlePreferenceActions() {
    this.actions$
      .pipe(
        ofActionSuccessful(LoadPreferenceSuccess, LoadPreferenceFail),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.preferenceData = this.getPreferenceData();

        this.preferenceDataLoadedSubject.next(true);
      });
  }

  private getPreferenceData() {
    return this.preferenceStoreService.getData(
      this.pageName,
      this.objectName,
      this.objectType,
    );
  }
}
