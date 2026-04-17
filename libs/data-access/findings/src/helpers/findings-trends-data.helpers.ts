import { TreeNode } from 'primeng/api';

import { TreeColumnDefinition } from '@customer-portal/shared';

import { bidirectionalMapTrendsYears } from '../constants';

const calculateSegmentSize = (segment: number, totalSize: number) =>
  (100 / (segment * 100)) * totalSize;

const createUniqueFieldsFromTreeStructure = (tree: TreeNode[]): Set<string> =>
  tree
    .map((node) => Object.keys(node.data))
    .reduce((fieldSet, fields) => {
      fields.forEach((item) => fieldSet.add(item));

      return fieldSet;
    }, new Set<string>());

const separateFieldsIntoStringAndNumericValues = (
  uniqueFields: (string | number)[],
): {
  stringFields: string[];
  numericFields: number[];
} =>
  uniqueFields.reduce<{
    stringFields: string[];
    numericFields: number[];
  }>(
    (acc, field) => {
      if (!Number.isNaN(Number(field))) {
        acc.numericFields.push(field as number);
      } else {
        acc.stringFields.push(field as string);
      }

      return acc;
    },
    { stringFields: [], numericFields: [] },
  );

const mapLastFourYearsToLabels = (
  uniqueLabels: Set<string>,
): (string | number)[] =>
  Array.from(uniqueLabels).map((field: string) => {
    if (bidirectionalMapTrendsYears.getValue(field)) {
      return bidirectionalMapTrendsYears.getValue(field)!;
    }

    return field;
  });

export const generateColumnsForTrends = (
  nodes: TreeNode[],
): TreeColumnDefinition[] => {
  const uniqueFields = createUniqueFieldsFromTreeStructure(nodes);
  const mappedUniqueFields = mapLastFourYearsToLabels(uniqueFields);
  const separatedFields =
    separateFieldsIntoStringAndNumericValues(mappedUniqueFields);

  separatedFields.numericFields.sort((a, b) => Number(a) - Number(b));

  const orderedFields = [
    ...separatedFields.stringFields,
    ...separatedFields.numericFields,
  ];

  return orderedFields.map((field) => ({
    field:
      (typeof field === 'number' &&
        bidirectionalMapTrendsYears.getKey(field)) ||
      String(field),
    header: String(field),
    isTranslatable: typeof field !== 'number',
    width: typeof field !== 'number' ? '60%' : '10%',
  }));
};

const collectAllNumericValuesFromNode = (
  node: TreeNode,
  numericValues: number[],
): void => {
  Object.keys(node.data).forEach((key) => {
    if (typeof node.data[key] === 'number') {
      numericValues.push(node.data[key]);
    }
  });

  if (node.children) {
    node.children.forEach((child) =>
      collectAllNumericValuesFromNode(child, numericValues),
    );
  }
};

const collectAllNumericValuesFromTree = (tree: TreeNode[]): number[] => {
  const numericValues: number[] = [];

  tree.forEach((rootNode) => {
    collectAllNumericValuesFromNode(rootNode, numericValues);
  });

  return numericValues;
};

const collectNumericValuesFromNodeByProperty = (
  node: TreeNode,
  numericValues: number[],
  targetProperty: string,
): void => {
  if (typeof node.data[targetProperty] === 'number') {
    numericValues.push(node.data[targetProperty]);
  }

  if (node.children) {
    node.children.forEach((child) =>
      collectNumericValuesFromNodeByProperty(
        child,
        numericValues,
        targetProperty,
      ),
    );
  }
};

const collectNumericValuesFromTreeByProperty = (
  tree: TreeNode[],
  targetProperty: string,
): number[] => {
  const numericValues: number[] = [];

  tree.forEach((rootNode) => {
    collectNumericValuesFromNodeByProperty(
      rootNode,
      numericValues,
      targetProperty,
    );
  });

  return numericValues;
};

export const generateGradientMapping = (
  data: TreeNode[],
  targetProperty?: string,
): Map<number, string> => {
  const findingCategory = 'findings-category';
  const numberOfSegments = 7;
  const gradientMapping: Map<number, string> = new Map();
  const descendingSortedValues = !targetProperty
    ? collectAllNumericValuesFromTree(data).sort((a, b) => b - a)
    : collectNumericValuesFromTreeByProperty(data, targetProperty).sort(
        (a, b) => b - a,
      );
  const uniqueValues = new Set(descendingSortedValues.map((value) => value));

  Array.from(uniqueValues.values()).forEach((value, index) => {
    const segmentSize = calculateSegmentSize(
      numberOfSegments,
      uniqueValues.size,
    );
    const segmentIndex = Math.ceil((index + 1) / segmentSize);
    const segmentName = targetProperty
      ? `${targetProperty}-${segmentIndex}`
      : `${findingCategory}-${segmentIndex}`;
    gradientMapping.set(value, segmentName);
  });

  return gradientMapping;
};
