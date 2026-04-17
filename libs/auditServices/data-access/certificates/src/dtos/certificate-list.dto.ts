import { CertificateListItemDto } from './certificate-list-item.dto';

export interface CertificateListDto {
  data: CertificateListItemDto[];
  isSuccess: boolean;
  message: string;
}
