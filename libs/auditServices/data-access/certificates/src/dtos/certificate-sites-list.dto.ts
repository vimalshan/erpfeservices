import { CertificateSiteListItemDto } from './certificate-site-list-item.dto';

export interface CertificateSitesListDto {
  data: CertificateSiteListItemDto[];
  isSuccess: boolean;
  message: string;
  errorCode: string;
}
