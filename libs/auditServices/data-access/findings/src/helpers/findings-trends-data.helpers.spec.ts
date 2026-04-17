import { TreeNode } from 'primeng/api';

import {
  generateColumnsForTrends,
  generateGradientMapping,
} from './findings-trends-data.helpers';

describe('generateGradientMapping', () => {
  test('should generate gradient mapping without target property', () => {
    // Arrange
    const data: TreeNode[] = [
      { data: { value: 10 }, children: [] },
      { data: { value: 20 }, children: [] },
    ];

    const expectedMapping = new Map<number, string>([
      [20, 'findings-category-4'],
      [10, 'findings-category-7'],
    ]);

    // Act
    const result = generateGradientMapping(data);

    // Assert
    expect(result).toEqual(expectedMapping);
  });

  test('should generate gradient mapping with target property', () => {
    // Arrange
    const data: TreeNode[] = [
      { data: { value: 30 }, children: [] },
      { data: { value: 40 }, children: [] },
    ];
    const expectedMapping = new Map<number, string>([
      [40, 'value-4'],
      [30, 'value-7'],
    ]);

    // Act
    const result = generateGradientMapping(data, 'value');

    // Assert
    expect(result).toEqual(expectedMapping);
  });

  test('should generate columns correctly', () => {
    // Arrange
    const nodes: TreeNode[] = [
      { data: { Year: '2024' }, children: [] },
      { data: { 2024: 'Year' }, children: [] },
    ];

    const expectedColumns = [
      {
        field: 'Year',
        header: 'Year',
        isTranslatable: true,
        width: '60%',
      },
      {
        field: '2024',
        header: '2024',
        isTranslatable: true,
        width: '60%',
      },
    ];

    // Act
    const result = generateColumnsForTrends(nodes);

    // Assert
    expect(result).toEqual(expectedColumns);
  });
});
