export const AUDIT_DAYS_DOUGHNUT_CHART_DATA = {
  data: {
    auditDaysbyServicePieChart: {
      data: {
        pieChartData: [
          {
            serviceName: 'ISO Audit',
            auditDays: 40,
            auditpercentage: 40.0,
          },
          {
            serviceName: 'Compliance Check',
            auditDays: 30,
            auditpercentage: 30.0,
          },
          {
            serviceName: 'Security Review',
            auditDays: 20,
            auditpercentage: 20.0,
          },
          {
            serviceName: 'Risk Assessment',
            auditDays: 10,
            auditpercentage: 10.0,
          },
        ],
        totalServiceAuditsDayCount: 100,
      },
    },
  },
};

export const AUDIT_DAYS_BAR_CHART_DATA = {
  data: {
    getAuditDaysByMonthAndService: {
      data: {
        chartData: [
          {
            month: 'January',
            serviceData: [
              {
                serviceName: 'ISO 901',
                auditDays: 15,
              },
              {
                serviceName: 'ISO 27001',
                auditDays: 10,
              },
              {
                serviceName: 'ISO 37001',
                auditDays: 25,
              },
            ],
          },
          {
            month: 'February',
            serviceData: [
              {
                serviceName: 'ISO 44001',
                auditDays: 20,
              },
              {
                serviceName: 'ISO 9001',
                auditDays: 5,
              },
              {
                serviceName: 'ISO 901',
                auditDays: 1,
              },
            ],
          },
          {
            month: 'March',
            serviceData: [
              {
                serviceName: 'ISO 44001',
                auditDays: 13,
              },
              {
                serviceName: 'ISO 9001',
                auditDays: 4,
              },
              {
                serviceName: 'ISO 901',
                auditDays: 15,
              },
            ],
          },
          {
            month: 'April',
            serviceData: [
              {
                serviceName: 'ISO 44001',
                auditDays: 21,
              },
              {
                serviceName: 'ISO 9001',
                auditDays: 52,
              },
              {
                serviceName: 'ISO 901',
                auditDays: 13,
              },
            ],
          },
          {
            month: 'May',
            serviceData: [
              {
                serviceName: 'ISO 44001',
                auditDays: 21,
              },
              {
                serviceName: 'ISO 9001',
                auditDays: 52,
              },
              {
                serviceName: 'ISO 901',
                auditDays: 13,
              },
            ],
          },
          {
            month: 'June',
            serviceData: [
              {
                serviceName: 'ISO 44001',
                auditDays: 21,
              },
              {
                serviceName: 'ISO 9001',
                auditDays: 52,
              },
              {
                serviceName: 'ISO 901',
                auditDays: 13,
              },
            ],
          },
          {
            month: 'November',
            serviceData: [
              {
                serviceName: 'ISO 44001',
                auditDays: 21,
              },
              {
                serviceName: 'ISO 9001',
                auditDays: 52,
              },
              {
                serviceName: 'ISO 901',
                auditDays: 13,
              },
            ],
          },
          {
            month: 'December',
            serviceData: [
              {
                serviceName: 'ISO 44001',
                auditDays: 21,
              },
              {
                serviceName: 'ISO 9001',
                auditDays: 52,
              },
              {
                serviceName: 'ISO 901',
                auditDays: 13,
              },
            ],
          },
        ],
      },
    },
  },
};

export const AUDIT_DAYS_MOCKED_RESPONSE_DATA = {
  isSuccess: true,
  message: '',
  errorCode: '',
  data: {
    getAuditDaysPerSite: {
      data: [
        {
          data: {
            id: 285,
            name: 'Brazil',
            auditDays: 5,
            dataType: 'Country',
          },
          children: [
            {
              data: {
                name: 'Contagem',
                auditDays: 2,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 173549,
                    name: 'MARELLI SISTEMAS AUTOMOTIVOS INDUSTRIA E COMERCIO BRASIL LTDA',
                    auditDays: 2,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Maua',
                auditDays: 3,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 171095,
                    name: 'MARELLI SISTEMAS AUTOMOTIVOS INDUSTRIA E COMERCIO LTDA',
                    auditDays: 3,
                    dataType: 'Site',
                  },
                },
              ],
            },
          ],
        },
        {
          data: {
            id: 310,
            name: 'Denmark',
            auditDays: 1,
            dataType: 'Country',
          },
          children: [
            {
              data: {
                name: 'Søborg',
                auditDays: 1,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172578,
                    name: 'ISS World Services A/S',
                    auditDays: 1,
                    dataType: 'Site',
                  },
                },
              ],
            },
          ],
        },
        {
          data: {
            id: 357,
            name: 'Italy',
            auditDays: 524,
            dataType: 'Country',
          },
          children: [
            {
              data: {
                name: ' Molfetta',
                auditDays: 22,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172857,
                    name: 'Exprivia S.p.A.',
                    auditDays: 22,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Caivano',
                auditDays: 131,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172428,
                    name: 'UNILEVER ITALIA MANUFACTURING S.r.l.',
                    auditDays: 2,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Casalpusterlengo',
                auditDays: 3,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172373,
                    name: 'UNILEVER ITALIA MANUFACTURING  S.r.l.',
                    auditDays: 3,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: "Colle Val d'Elsa",
                auditDays: 9,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172437,
                    name: 'Intercultura ODV-Centro di Formazione Interculturale, Direzione Programmi, Sviluppo del volontariato',
                    auditDays: 9,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Collecchio',
                auditDays: 4,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 173540,
                    name: 'MUTTI S.p.A. - Sito operativo',
                    auditDays: 4,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Lecce',
                auditDays: 22,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172851,
                    name: 'Exprivia S.p.A.',
                    auditDays: 22,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Matera',
                auditDays: 22,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172125,
                    name: 'Exprivia S.p.A.',
                    auditDays: 22,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Milano',
                auditDays: 31,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172853,
                    name: 'Exprivia S.p.A.',
                    auditDays: 22,
                    dataType: 'Site',
                  },
                },
                {
                  data: {
                    id: 172394,
                    name: 'Intercultura ODV',
                    auditDays: 9,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Molfetta ',
                auditDays: 22,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172849,
                    name: 'Exprivia S.p.A.',
                    auditDays: 22,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Montechiarugolo',
                auditDays: 167,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172361,
                    name: 'MUTTI S.p.A.',
                    auditDays: 1,
                    dataType: 'Site',
                  },
                },
                {
                  data: {
                    id: 173568,
                    name: 'MUTTI S.p.A. - RED STORE',
                    auditDays: 4,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Palermo',
                auditDays: 22,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172084,
                    name: 'Exprivia S.p.A.',
                    auditDays: 22,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Pescara',
                auditDays: 1,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172396,
                    name: 'MOLINO E PASTIFICIO DE CECCO S.p.A.',
                    auditDays: 1,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Roma',
                auditDays: 22,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172854,
                    name: 'Exprivia S.p.A.',
                    auditDays: 22,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Sedico',
                auditDays: 1,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172553,
                    name: 'HIBER POLARIS Ali Group S.r.l. – Unità locale di Sedico (BL)',
                    auditDays: 1,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Trento',
                auditDays: 22,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172855,
                    name: 'Exprivia S.p.A.',
                    auditDays: 22,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Vicenza',
                auditDays: 22,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172856,
                    name: 'Exprivia S.p.A.',
                    auditDays: 22,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Vittorio Veneto',
                auditDays: 1,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172555,
                    name: 'ALI COOKING & REFRIGERATION PARTS - ALI GROUP S.r.l.',
                    auditDays: 1,
                    dataType: 'Site',
                  },
                },
              ],
            },
          ],
        },
        {
          data: {
            id: 386,
            name: 'Mexico',
            auditDays: 9,
            dataType: 'Country',
          },
          children: [
            {
              data: {
                name: 'SALTILLO',
                auditDays: 9,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 173563,
                    name: 'Marelli Ride Dynamics S. de R.L. de C.V.',
                    auditDays: 5,
                    dataType: 'Site',
                  },
                },
              ],
            },
            {
              data: {
                name: 'Saltillo',
                auditDays: 9,
                dataType: 'City',
              },
              children: [
                {
                  data: {
                    id: 172894,
                    name: 'Marelli Toluca México S. de R.L. de C.V',
                    auditDays: 4,
                    dataType: 'Site',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
