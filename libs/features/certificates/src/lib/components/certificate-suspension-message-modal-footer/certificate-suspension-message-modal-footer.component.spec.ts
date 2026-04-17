import { CertificateSuspensionMessageModalFooterComponent } from './certificate-suspension-message-modal-footer.component';

describe('CertificateSuspensionMessageModalFooterComponent', () => {
  let component: CertificateSuspensionMessageModalFooterComponent;
  let mockDialogRef: { close: jest.Mock };

  beforeEach(() => {
    mockDialogRef = { close: jest.fn() };
    component = new CertificateSuspensionMessageModalFooterComponent(
      mockDialogRef as any,
    );
  });

  test('should close dialog with data when closeDialog is called', () => {
    // Act
    component.closeDialog(true);

    // Assert
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  test('should close dialog without data on ngOnDestroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });
});
