import {
  SettingsCompanyDetailsCountryListDataDto,
  SettingsCompanyDetailsDataDto,
  SettingsCompanyDetailsLegalEntityDto,
} from '../../dtos';
import {
  SettingsCompanyDetailsCountryListData,
  SettingsCompanyDetailsCountryListModel,
  SettingsCompanyDetailsData,
  SettingsCompanyDetailsModel,
} from '../../models';

export class SettingsCompanyDetailsMapperService {
  static mapToSettingsCompanyDetailsModel(
    data: SettingsCompanyDetailsDataDto,
  ): SettingsCompanyDetailsModel {
    return {
      isUserAdmin: data.isAdmin,
      legalEntityList: this.getSettingsCompanyDetailsLegalEntityList(
        data?.legalEntities,
      ),
      parentCompany: this.getSettingsCompanyDetailsParentCompany(
        data?.parentCompany,
      ),
    };
  }

  static mapToSettingsCompanyDetailsCountryListModel(
    data: SettingsCompanyDetailsCountryListDataDto[],
  ): SettingsCompanyDetailsCountryListModel {
    return this.getSettingsCompanyDetailsCountryListModel(data);
  }

  private static getSettingsCompanyDetailsLegalEntityList(
    legalEntities: SettingsCompanyDetailsLegalEntityDto[],
  ) {
    return (legalEntities || []).map((legalEntity) =>
      this.getSettingsCompanyDetailsData(legalEntity),
    );
  }

  private static getSettingsCompanyDetailsParentCompany(
    parentCompany: SettingsCompanyDetailsLegalEntityDto | null,
  ) {
    return parentCompany
      ? this.getSettingsCompanyDetailsData(parentCompany)
      : null;
  }

  private static getSettingsCompanyDetailsData(
    datum: SettingsCompanyDetailsLegalEntityDto,
  ): SettingsCompanyDetailsData {
    return {
      accountId: datum.accountId,
      accountDNVId: datum.accountDNVId,
      address: datum.address,
      city: datum.city,
      country: datum.country,
      countryCode: datum.countryCode,
      countryId: datum.countryId,
      organizationName: datum.organizationName,
      poNumberRequired: datum.poNumberRequired,
      vatNumber: datum.vatNumber,
      zipcode: datum.zipCode,
      updatePending: datum.isSerReqOpen,
    };
  }

  private static getSettingsCompanyDetailsCountryListModel(
    data: SettingsCompanyDetailsCountryListDataDto[],
  ): SettingsCompanyDetailsCountryListModel {
    const countryList: SettingsCompanyDetailsCountryListData[] = [];
    let countryActiveId = null;

    data.forEach((datum) => {
      if (datum.isActive) {
        countryActiveId = datum.id;
      }
      countryList.push({
        label: datum.countryName,
        value: datum.id,
      });
    });

    return { countryList, countryActiveId };
  }
}
