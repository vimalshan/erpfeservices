import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  CertificateDetailsStoreService,
  CertificateDownloadDialogData,
  createCertificateDetailsStoreServiceMock,
} from '@customer-portal/data-access/certificates';
import { LanguageOption } from '@customer-portal/shared';

import { CertificateGuidelines } from '../../constants';
import { CertificateDownloadDialogComponent } from './certificate-download-dialog.component';

describe('CertificateDownloadDialogComponent', () => {
  let component: CertificateDownloadDialogComponent;
  const mockDynamicDialogConfig = {};
  const mockDynamicDialogRef = {};
  const mockCertificateDetailsStoreService: Partial<CertificateDetailsStoreService> =
    createCertificateDetailsStoreServiceMock();

  beforeEach(async () => {
    component = new CertificateDownloadDialogComponent(
      mockDynamicDialogConfig as DynamicDialogConfig,
      mockDynamicDialogRef as DynamicDialogRef,
      mockCertificateDetailsStoreService as CertificateDetailsStoreService,
    );
  });

  test('should call onUpdateLanguage and onUpdateCertificationMarkGuidelineUrl on ngOnInit if selectedLanguage exists', () => {
    // Arrange
    component.selectedLanguage = {
      language: 'English',
    } as LanguageOption;
    component.dialogData = {
      serviceName: 'ISO9001',
    } as CertificateDownloadDialogData;
    const onUpdateLanguageSpy = jest.spyOn(component, 'onUpdateLanguage');
    const onUpdateCertificationMarkGuidelineUrlSpy = jest.spyOn(
      component as any,
      'onUpdateCertificationMarkGuidelineUrl',
    );

    // Act
    component.ngOnInit();

    // Assert
    expect(onUpdateLanguageSpy).toHaveBeenCalledWith({
      value: component.selectedLanguage,
    });
    expect(onUpdateCertificationMarkGuidelineUrlSpy).toHaveBeenCalledWith(
      component.selectedLanguage.language,
    );
  });

  test('should open guideline URL in new window when enabled', () => {
    // Arrange
    const windowOpenSpy = jest
      .spyOn(window, 'open')
      .mockImplementation(() => null);
    component.isViewCertificationGuidelinesEnabled = true;
    (component as any).guidelineUrl = 'https://test-guideline-url';

    // Act
    component.onViewCertificationMarkGuidelines();

    // Assert
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://test-guideline-url',
      '_blank',
    );

    // Cleanup
    windowOpenSpy.mockRestore();
  });

  test('should not open guideline URL when disabled', () => {
    // Arrange
    const windowOpenSpy = jest
      .spyOn(window, 'open')
      .mockImplementation(() => null);
    component.isViewCertificationGuidelinesEnabled = false;

    // Act
    component.onViewCertificationMarkGuidelines();

    // Assert
    expect(windowOpenSpy).not.toHaveBeenCalled();

    // Cleanup
    windowOpenSpy.mockRestore();
  });

  test('should close the dialog with the correct data when calling onDownload', () => {
    // Arrange
    component.selectedLanguage = {
      code: 'en',
      isSelected: true,
    } as LanguageOption;
    (component as any).ref = {
      close: jest.fn(),
    } as unknown as DynamicDialogRef;

    // Act
    component.onDownload();

    // Assert
    expect((component as any).ref.close).toHaveBeenCalledWith({
      isSubmitted: true,
      languageCode: 'en',
    });
  });

  test('should close the dialog with the correct data when calling onClose', () => {
    // Arrange
    (component as any).ref = {
      close: jest.fn(),
    } as unknown as DynamicDialogRef;

    // Act
    component.onClose();

    // Assert
    expect((component as any).ref.close).toHaveBeenCalledWith({
      isSubmitted: false,
    });
  });

  test('should reset and load certification marks on onUpdateLanguage', () => {
    // Arrange
    const mockedPayload = { value: { language: 'English' } as LanguageOption };
    const resetSpy = jest.spyOn(
      mockCertificateDetailsStoreService,
      'resetAllCertificationMarks',
    );
    const loadSpy = jest.spyOn(
      mockCertificateDetailsStoreService,
      'loadAllCertificationMarks',
    );

    component.dialogData = {
      serviceName: 'ISO9001',
    } as CertificateDownloadDialogData;

    // Act
    component.onUpdateLanguage(mockedPayload);

    // Assert
    expect(resetSpy).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalledWith('ISO9001', 'English');
  });

  test('should set guidelineUrl and disable/enable guideline button correctly', () => {
    // Arrange
    const mockedLanguage = 'English';

    // Act
    (component as any).onUpdateCertificationMarkGuidelineUrl(mockedLanguage);

    // Assert
    expect((component as any).guidelineUrl).toEqual(
      CertificateGuidelines[
        mockedLanguage as keyof typeof CertificateGuidelines
      ],
    );
    expect(component.isViewCertificationGuidelinesEnabled).toBe(true);
  });

  test('should disable guideline button if guidelineUrl not found', () => {
    // Arrange
    const mockedLanguage = 'UnknownLanguage';

    // Act
    (component as any).onUpdateCertificationMarkGuidelineUrl(mockedLanguage);

    // Assert
    expect((component as any).guidelineUrl).toBeUndefined();
    expect(component.isViewCertificationGuidelinesEnabled).toBe(false);
  });
});
