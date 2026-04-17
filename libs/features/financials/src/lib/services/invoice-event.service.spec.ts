import { TranslocoService } from '@jsverse/transloco';
import { DialogService } from 'primeng/dynamicdialog';

import {
  UpdatePlannedPaymentDateComponent,
  UpdatePlannedPaymentDateFooterComponent,
} from '../components';
import { InvoiceEventService } from './invoice-event.service';

describe('InvoiceEventService', () => {
  let service: InvoiceEventService;
  let dialogServiceMock: Partial<DialogService> = {};
  let translocoServiceMock: Partial<TranslocoService> = {};

  beforeEach(() => {
    dialogServiceMock = {
      open: jest.fn().mockReturnValue({
        close: jest.fn(),
      }),
    };

    translocoServiceMock = {
      translate: jest.fn().mockReturnValue('Translated Header'),
    };

    service = new InvoiceEventService(
      dialogServiceMock as DialogService,
      translocoServiceMock as TranslocoService,
    );
  });

  test('should call dialogService.open with correct parameters', () => {
    // Arrange
    const invoiceIds = ['1', '2', '3'];

    // Act
    service.openUpdatePaymentDateModal(invoiceIds);

    // Assert
    expect(dialogServiceMock.open).toHaveBeenCalledWith(
      UpdatePlannedPaymentDateComponent,
      {
        header: 'Translated Header',
        width: '50vw',
        contentStyle: { overflow: 'auto', padding: '0' },
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw',
        },
        data: {
          invoiceIds,
        },
        focusOnShow: false,
        templates: {
          footer: UpdatePlannedPaymentDateFooterComponent,
        },
      },
    );
  });
});
