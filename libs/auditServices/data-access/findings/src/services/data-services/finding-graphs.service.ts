import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  FindingByClauseListDto,
  FindingResponsesDto,
  FindingsTrendsGraphDto,
  OpenFindingsGraphDto,
} from '../../dtos';
import { FindingsTrendsResponse } from '../../dtos/findings-trends-data.dto';
import {
  FINDING_TRENDS_LIST_QUERY,
  FINDINGS_BY_CLAUSE_LIST_QUERY,
  FINDINGS_BY_SITE_LIST_QUERY,
  FINDINGS_TRENDS_GRAPH_QUERY,
  OPEN_FINDINGS_GRAPH_QUERY,
} from '../../graphql';
import { OpenFindingsMonthsPeriod } from '../../models';

@Injectable({ providedIn: 'root' })
export class FindingGraphsService {
  private clientName = 'finding';

  constructor(private readonly apollo: Apollo) {}

  // #region FindingTrendsGraphs
  getFindingsTrendsGraphData(
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<FindingsTrendsGraphDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDINGS_TRENDS_GRAPH_QUERY,
        variables: {
          companies,
          services,
          sites,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.findingsByCategory));
  }

  getFindingsTrendsData(
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<FindingsTrendsResponse> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDING_TRENDS_LIST_QUERY,
        variables: { companies, services, sites },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results.data.trendList));
  }

  // #endregion FindingTrendsGraphs

  // #region OpenFindingsGraphs
  getOpenFindingsGraphData(
    period: OpenFindingsMonthsPeriod,
    startDate: Date | null,
    endDate: Date | null,
    companies: number[],
    services: number[],
    sites: number[],
    responsetype: string,
  ): Observable<OpenFindingsGraphDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: OPEN_FINDINGS_GRAPH_QUERY,
        variables: {
          period,
          startDate,
          endDate,
          companies,
          services,
          sites,
          responsetype,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results.data.getOpenFindingschartviewData));
  }

  // #endregion OpenFindingsGraphs

  // #region FindingsByClause
  getFindingsByClauseList(
    startDate: Date | null,
    endDate: Date | null,
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<FindingByClauseListDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDINGS_BY_CLAUSE_LIST_QUERY,
        variables: {
          filters: {
            startDate,
            endDate,
            companies,
            services,
            sites,
          },
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.findingsByClauseList));
  }
  // #endregion FindingsByClause

  // #region FindingsBySite
  getFindingsBySiteList(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
    country: number[],
  ): Observable<FindingResponsesDto[]> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDINGS_BY_SITE_LIST_QUERY,
        variables: {
          companies,
          services,
          startDate,
          endDate,
          country,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.getFindingBySite));
  }
}
