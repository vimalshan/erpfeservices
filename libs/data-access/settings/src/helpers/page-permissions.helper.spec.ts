import { isValidKey } from './page-permissions.helper';

describe('PagePermissionsHelper', () => {
  describe('isValidKey', () => {
    test('should return true for valid keys', () => {
      // Arrange
      const mockUserPermissions = {
        audits: { noAccess: false, view: true, edit: true },
      };

      // Act
      const isKeyValid = isValidKey('audits', mockUserPermissions, false);

      // Assert
      expect(isKeyValid).toBe(true);
    });

    test('should return returnType for invalid keys', () => {
      // Arrange
      const mockUserPermissions = {
        audits: { noAccess: false, view: true, edit: true },
      };
      const mockReturnType = null;

      // Act
      const isKeyValid = isValidKey(
        'Audits',
        mockUserPermissions,
        mockReturnType,
      );

      // Assert
      expect(isKeyValid).toBe(mockReturnType);
    });
  });
});
