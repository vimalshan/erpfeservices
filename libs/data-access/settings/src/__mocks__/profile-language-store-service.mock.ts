import { signal } from '@angular/core';
import { of } from 'rxjs';

export const createProfileLanguageStoreServiceMock = () => ({
  languageLabel: signal('en'),
  certificateId: signal(123),
  loadProfileLanguage: jest.fn(),
  updateProfileLanguage: jest.fn(),
  profileLanguageLabel: of('en'),
});
