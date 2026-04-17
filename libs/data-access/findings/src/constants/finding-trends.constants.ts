import { BidirectionalMap } from '@customer-portal/shared/helpers/bidirectional-map';

const currentYear = new Date().getFullYear();

export const bidirectionalMapTrendsYears = new BidirectionalMap<string, number>(
  [
    ['currentYear', currentYear],
    ['lastYear', currentYear - 1],
    ['yearBeforeLast', currentYear - 2],
    ['yearMinus3', currentYear - 3],
  ],
);
