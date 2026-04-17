export interface ExternalAppModel {
  id: number;
  title: string;
  subTitle: string;
  imageUrl: string;
  link: string;
}

export const EXTERNAL_APPS = [
  {
    id: 0,
    title: 'apps.boostAuditTitle',
    subTitle: 'apps.boostAuditDescription',
    imageUrl: 'assets/external-apps/boostAudit-external.jpg',
    link: 'https://boostmyaudit.dnv.com/',
  },
  {
    id: 1,
    title: 'apps.luminaTitle',
    subTitle: 'apps.luminaDescription',
    imageUrl: './assets/external-apps/lumina-external.jpg',
    link: 'https://lumina.dnv.com/home',
  },
  {
    id: 2,
    title: 'apps.selfAssessmentToolTitle',
    subTitle: 'apps.selfAssessmentToolDescription',
    imageUrl: './assets/external-apps/selfAssessmentTool.png',
    link: 'https://www.dnv.com/assurance/general/online-self-assessment-suite',
  },
];
