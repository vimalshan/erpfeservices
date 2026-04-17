import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { CertificateSuspensionMessageModalComponent } from './certificate-suspension-message-modal.component';

describe('CertificateSuspensionMessageModalComponent', () => {
  let component: CertificateSuspensionMessageModalComponent;
  let mockProfileStoreService: { profileInformation: jest.Mock };

  beforeEach(() => {
    const mockDynamicDialogConfig: Partial<DynamicDialogConfig> = {
      data: {
        certificateNumber: 'certificateNumber',
        siteName: 'siteName',
        services: 'services',
      },
    };

    mockProfileStoreService = {
      profileInformation: jest.fn().mockReturnValue({ firstName: 'John' }),
    };
    component = new CertificateSuspensionMessageModalComponent(
      mockProfileStoreService as any,
      mockDynamicDialogConfig as DynamicDialogConfig,
    );
  });

  test('should create the component', () => {
    // Assert
    expect(component).toBeDefined();
  });

  test('should expose profileStoreService', () => {
    // Assert
    expect(component.profileStoreService).toBe(mockProfileStoreService);
  });

  test('should return correct firstName from profileInformation', () => {
    // Act
    const profile = component.profileStoreService.profileInformation();

    // Assert
    expect(profile.firstName).toBe('John');
    expect(mockProfileStoreService.profileInformation).toHaveBeenCalled();
  });
});
