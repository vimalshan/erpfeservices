import { BaseApolloResponse } from '@customer-portal/shared';

interface CategoryCount{
    key: string;
    value: number;
}

export interface ClauseLitTrend{
    name: string;
    totalCount: number;
    categoriesCounts: CategoryCount[];
}

export interface FindingsByClause{
    data: ClauseLitTrend;
}

export interface FindingsByChapter{
    data: ClauseLitTrend;
    children: FindingsByClause[];
}

export interface FindingsByClauseListTrendData{
    data: ClauseLitTrend;
    children: FindingsByChapter[];
}

export interface FindingByClauseListDto 
extends BaseApolloResponse<FindingsByClauseListTrendData[]>{
    data: FindingsByClauseListTrendData[];
}

