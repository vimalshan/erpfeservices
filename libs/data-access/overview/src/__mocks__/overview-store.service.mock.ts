import { signal, WritableSignal } from '@angular/core';

import { CardDataModel } from '@customer-portal/shared';

const overviewCardsData = [
  {
    cardData: {
      service: 'test service',
      yearlyData: [
        {
          year: { label: 'test label', index: 0 },
          details: [
            {
              entity: 'test name',
              entityTranslationKey: 'test text',
              stats: { currentValue: 0, maxValue: 0, percentage: 0 },
            },
          ],
        },
      ],
    },
  },
];

const overviewCardData: WritableSignal<CardDataModel[]> =
  signal(overviewCardsData);

export const createOverviewStoreServiceMock = () => ({
  overviewCardData,
  loadOverviewCardData: jest.fn(),
  loadMoreOverviewCardData: jest.fn(),
  resetOverviewCardData: jest.fn(),
  navigateFromOverviewCardToListView: jest.fn(),
});
