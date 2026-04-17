import { createSelector, Selector } from '@ngxs/store';

import { PreferenceState, PreferenceStateModel } from './preference.state';

export class PreferenceSelectors {
  static data(pageName: string, objectName: string, objectType: string) {
    const emptyPreference = {
      filters: {},
      rowsPerPage: 10,
    };

    return createSelector([PreferenceState], (state: PreferenceStateModel) => {
      if (!state) {
        return emptyPreference;
      }

      const preference = state.preferenceItems.find(
        (item) =>
          item.pageName === pageName &&
          item.objectType === objectType &&
          item.objectName === objectName,
      );

      return preference ? structuredClone(preference.data) : emptyPreference;
    });
  }

  @Selector()
  static isLoading(state: PreferenceStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static error(state: PreferenceStateModel): string | null {
    return state.error;
  }
}
