import { TreeNode } from 'primeng/api';

export interface SharedSelectTreeChangeEventOutput {
  filter: number[];
  prefill: TreeNode[];
}

export interface CustomTreeNode extends TreeNode {
  id?: number;
  label?: string;
  children?: CustomTreeNode[];
  data?: any;
  selectable?: boolean;
}
