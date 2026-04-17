import { TreeNode } from 'primeng/api';

export type AuditDaysGridModel = TreeNode<AuditDaysNode>;

export interface AuditDaysNode {
  location: string;
  auditDays: number;
  dataType: string;
}
