export const createDocumentStoreServiceMock = () => ({
  downloadDocument: jest.fn(),
  loadUploadDocumentsInfo: jest.fn(),
  switchCanUploadData: jest.fn(),
  uploadDocuments: jest.fn(),
  deleteDocument: jest.fn(),
  downloadAllDocuments: jest.fn(),
});
