import { AuditDaysGridDto, AuditDaysNodeDto } from '../../dtos';
import { AuditDaysGridModel } from '../../models';

export class AuditDaysGridMapperService {
  static mapToAuditDaysGridModel(dto: AuditDaysGridDto): AuditDaysGridModel[] {
    return dto.data?.length ? dto.data.map((node) => this.mapNode(node)) : [];
  }

  private static mapNode(node: AuditDaysNodeDto): AuditDaysGridModel {
    return {
      data: {
        location: node.data.name,
        auditDays: node.data.auditDays,
        dataType: node.data.dataType.toLowerCase(),
      },
      children: node.children
        ? node.children.map((children) => this.mapNode(children))
        : [],
    };
  }
}
