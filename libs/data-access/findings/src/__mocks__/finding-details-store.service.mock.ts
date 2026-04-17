import { computed, signal } from '@angular/core';
import { of } from 'rxjs';

import { FilterOptions, LanguageOption } from '@customer-portal/shared';

import {
  FindingDetailsDescription,
  FindingDetailsModel,
  FindingHistoryResponseModel,
  FindingResponsesModel,
} from '../models';

const languageOptions: LanguageOption[] = [
  { language: 'English', isSelected: true },
  { language: 'French', isSelected: false },
];

const findingDetails: FindingDetailsModel = {
  findingNumber: 'MANMES-0031',
  header: {
    acceptedDate: '18-05-2024',
    auditNumber: '3067486',
    auditType: 'CAT1 (major)',
    auditor: 'Auditor',
    city: 'Arnhem',
    closeDate: '18-05-2024',
    dueDate: '18-05-2024',
    openDate: '18-05-2024',
    site: 'DNV GL GSS IT',
    services: 'IFS Food version 8 April 2023 || FSC-STD-40-004 V3-1',
    status: 'Open',
  },
  primaryLanguageDescription: {
    category: 'CAT1 - Major',
    clause: 'Clause',
    description: 'Description',
    focusArea: 'Focus Area',
    language: 'English',
    isPrimaryLanguage: true,
    isSelected: true,
    title: 'Title',
  },
  secondaryLanguageDescription: {
    category: 'CAT1 - Major',
    clause: 'Clause',
    description: 'Description',
    focusArea: 'Focus Area',
    language: 'Norwegian',
    isPrimaryLanguage: false,
    isSelected: false,
    title: 'Title',
  },
};

const findingDetailsDescription: FindingDetailsDescription =
  findingDetails.primaryLanguageDescription;

const latestFindingResponses: FindingResponsesModel = {
  isSubmit: true,
  formValue: {
    correctionAction: 'correction action',
    nonConformity: 'nonconformity',
    rootCause: 'root cause',
  },
};

const responseHistory: FindingHistoryResponseModel[] = [
  {
    userName: 'Marq Sanches',
    isAuditor: false,
    responseDateTime: '01-05-2024 11:23',
    rootCause: 'Root Cause',
    correctiveAction: 'Corrective Action',
    correction: 'Correction',
  },
  {
    userName: 'DNV | Arne Arnesson',
    isAuditor: true,
    responseDateTime: '01-05-2024 13:44',
    auditorComment: 'Please provide a better explanation of the root cause.',
  },
  {
    userName: 'Marq Sanches',
    isAuditor: false,
    responseDateTime: '01-05-2024 18:37',
    rootCause: 'Root Cause',
    correctiveAction: 'Corrective Action',
    correction: 'Correction',
  },
];

export const createFindingDetailsStoreServiceMock = () => ({
  loadFindingDetails: jest.fn(),
  changeFindingDetailsLanguage: jest.fn(),
  sendFindingResponsesForm: jest.fn(),
  loadResponseFindingsHistory: jest.fn(),
  loadFindingDocumentsList: jest.fn(),
  findingDetails: signal(findingDetails),
  languageOptions: signal(languageOptions),
  findingDetailsDescription: signal(findingDetailsDescription),
  latestFindingResponses: signal(latestFindingResponses),
  shouldDisplayRespondButtons: signal(true),
  responseHistory: signal(responseHistory),
  findingId$: jest.fn(() => of('finding-id')),
  findingId: signal('finding-id'),
  auditId: signal('audit-id'),
  findingParams: computed(() => ({
    findingId: 'finding-id',
  })),
  documentsList: signal([]),
  filterOptions: signal<FilterOptions>({}),
  documentsListHasActiveFilters: signal(false),
  updateGridConfig: jest.fn(),
  isFindingResponseFormDirty$: jest.fn(() => of('true')),
  resetFindingDetailsState: jest.fn(),
  isFindingOpenOrAccepted: signal(true),
  setIsFindingResponseFormDirtyFlag: jest.fn(),
});
