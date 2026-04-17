import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { ContractsListDto } from '../../../dtos';
import { ContractsListService } from './contracts-list.service';

describe('ContractsListService', () => {
  let service: ContractsListService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
    } as any;

    service = new ContractsListService(httpClientMock);
  });

  describe('getContractsList', () => {
    test('should call getContractsList and return contract list data', (done) => {
      // Arrange
      const mockContractsList: ContractsListDto = {
        data: [
          {
            contractId: '123',
            contractName: 'Test Contract',
            contractType: 'Type A',
            company: 'Test Company',
            service: 'Test Service',
            sites: 'Test Site',
            dateAdded: '2024-02-12',
          },
        ],
        isSuccess: true,
      };
      httpClientMock.get = jest.fn().mockReturnValue(of(mockContractsList));

      const url = `${environment.documentsApi}/ContractList`;

      // Act
      service.getContractsList().subscribe((result) => {
        // Assert
        expect(httpClientMock.get).toHaveBeenCalledWith(url);
        expect(result).toEqual(mockContractsList);
        done();
      });
    });
  });

  describe('exportContractsExcel', () => {
    test('should call exportContractsExcel API and return the expected response', (done) => {
      // Arrange
      const filters = {
        contractName: null,
        contractType: null,
        company: null,
        siteName: null,
        service: null,
        dateAdded: null,
      };
      const mockResponse = { data: [1, 2, 3] };
      const expectedUrl = `${environment.documentsApi}/ExportContract`;

      httpClientMock.post = jest.fn().mockReturnValue(of(mockResponse));

      // Act
      service.exportContractsExcel({ filters }).subscribe((result) => {
        // Assert
        expect(httpClientMock.post).toHaveBeenCalledWith(expectedUrl, {
          filters,
        });
        expect(result).toEqual([1, 2, 3]);
        done();
      });
    });
  });
});
