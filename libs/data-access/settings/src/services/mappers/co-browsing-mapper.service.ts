import { CoBrowsingCompanyDto } from '../../dtos';
import { CoBrowsingCompany } from '../../models';

export class CoBrowsingMapperService {
  static mapToCoBrowsingCompanyList(
    dto: CoBrowsingCompanyDto[],
  ): CoBrowsingCompany[] {
    return dto.map((item: CoBrowsingCompanyDto) => ({
      label: item.companyName,
      value: item.companyName,
      id: item.id,
    }));
  }
}
