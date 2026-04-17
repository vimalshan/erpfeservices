export const overviewUpcomingAuditsMock = {
  data: {
    getWidgetForUpcomingAudit: {
      isSuccess: true,
      message: 'Success',
      errorCode: '',
      data: [
        {
          confirmed: [
            '2025-03-03',
            '2025-03-04',
            '2025-03-05',
            '2025-03-06',
            '2025-03-13',
            '2025-03-18',
            '2025-03-19',
            '2025-03-20',
          ],
          toBeConfirmed: ['2025-03-12'],
          toBeConfirmedByDNV: ['2025-03-13'],
        },
      ],
    },
  },
};
