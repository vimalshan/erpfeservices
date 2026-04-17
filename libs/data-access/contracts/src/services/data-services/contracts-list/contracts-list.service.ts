import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable, of } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { ContractsExcelPayloadDto, ContractsListDto } from '../../../dtos';

@Injectable({ providedIn: 'root' })
export class ContractsListService {
  private readonly CACHE_DURATION_MS = environment.cacheDuration || 3600000;
  private readonly destroyRef = inject(DestroyRef);
  private readonly exportContractExcelUrl = `${environment.documentsApi}/ExportContract`;

  private readonly cache = signal<{
    data: ContractsListDto | null;
    timestamp: number | null;
  }>({ data: null, timestamp: null });

  private readonly isValidCache = computed(() => {
    const { data, timestamp } = this.cache();
    if (!data || !timestamp) return false;

    return Date.now() - timestamp < this.CACHE_DURATION_MS;
  });

  private cacheTimer: any;

  constructor(private readonly httpClient: HttpClient) {}

  getContractsList(): Observable<ContractsListDto> {
    if (this.isValidCache()) {
      const cachedData = this.cache().data!;

      return of(cachedData);
    }

    const { documentsApi } = environment;
    const url = `${documentsApi}/ContractList`;

    return this.httpClient
      .get<ContractsListDto>(url, { observe: 'response' })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((response) => {
          if (response.status === 200 && response.body) {
            this.setupCache(response.body);

            return response.body;
          }
          this.clearCache();

          return response.body as ContractsListDto;
        }),
      );
  }

  exportContractsExcel(
    { filters }: ContractsExcelPayloadDto,
    skipLoading?: boolean,
  ): Observable<number[]> {
    let headers = new HttpHeaders();

    if (skipLoading) {
      headers = headers.append('SKIP_LOADING', 'true');
    }

    return this.httpClient
      .post<{
        data: number[];
      }>(this.exportContractExcelUrl, filters, { headers })
      .pipe(map((response) => response.data));
  }

  private setupCache(data: ContractsListDto): void {
    this.cache.set({ data, timestamp: Date.now() });
    this.setupCacheTimer();
  }

  private setupCacheTimer(): void {
    this.clearCacheTimer();

    this.cacheTimer = setTimeout(() => {
      this.clearCache();
      this.cacheTimer = null;
    }, this.CACHE_DURATION_MS);
  }

  private clearCacheTimer(): void {
    if (this.cacheTimer) {
      clearTimeout(this.cacheTimer);
      this.cacheTimer = null;
    }
  }

  private clearCache(): void {
    this.cache.set({ data: null, timestamp: null });
    this.clearCacheTimer();
  }
}
