export interface FindingsTrendsGraphDto {
  data: {
    categories: FindingCategoryDto[];
  };
  isSuccess: boolean;
  message: string;
  errorCode: string;
}

export interface FindingCategoryDto {
  categoryName: string;
  findings: FindingsCountDto[];
}

export interface FindingsCountDto {
  year: number;
  count: number;
}
