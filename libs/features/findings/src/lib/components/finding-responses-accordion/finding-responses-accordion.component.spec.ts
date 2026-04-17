import { TranslocoService } from '@jsverse/transloco';

import {
  createFindingDetailsStoreServiceMock,
  FindingDetailsStoreService,
} from '@customer-portal/data-access/findings';
import { createTranslationServiceMock } from '@customer-portal/shared';

import { FindingResponsesAccordionComponent } from './finding-responses-accordion.component';

jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');

  return {
    ...actual,
    effect: jest.fn((fn) => fn()),
  };
});

describe('FindingResponsesAccordionComponent', () => {
  let component: FindingResponsesAccordionComponent;
  const findingsDetailsStoreServiceMock: Partial<FindingDetailsStoreService> =
    createFindingDetailsStoreServiceMock();

  beforeEach(async () => {
    component = new FindingResponsesAccordionComponent(
      createTranslationServiceMock() as TranslocoService,
      findingsDetailsStoreServiceMock as FindingDetailsStoreService,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should reset tab indexes', () => {
    // Arrange
    (component as any).selectedTabsIndex.set([1, 2, 3]);

    // Act
    (component as any).resetTabsIndexes();

    // Assert
    expect((component as any).selectedTabsIndex()).toEqual([]);
  });

  test('should add index to selectedTabsIndex when tab is selected', () => {
    // Act
    component.onSelectedChange(true, 0);

    // Assert
    expect(component['selectedTabsIndex']()).toContain(0);
  });

  test('should remove index from selectedTabsIndex when tab is deselected', () => {
    // Act
    component.onSelectedChange(true, 0);
    component.onSelectedChange(false, 0);

    // Assert
    expect(component['selectedTabsIndex']()).not.toContain(0);
  });

  test('should handle multiple selections correctly', () => {
    // Act
    component.onSelectedChange(true, 0);
    component.onSelectedChange(true, 1);

    // Assert
    expect(component['selectedTabsIndex']()).toContain(0);
    expect(component['selectedTabsIndex']()).toContain(1);

    // Act
    component.onSelectedChange(false, 0);

    // Assert
    expect(component['selectedTabsIndex']()).not.toContain(0);
    expect(component['selectedTabsIndex']()).toContain(1);
  });

  test('should not remove an index that is not in the selectedTabsIndex', () => {
    // Act
    component.onSelectedChange(false, 0);

    // Assert
    expect(component['selectedTabsIndex']()).not.toContain(0);
  });
});
