import { CertificateComponent } from './certificate.component';

describe('CertificateComponent', () => {
  let component: CertificateComponent;

  beforeEach(() => {
    component = new CertificateComponent();
  });

  test('should be created', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('should have correct pageToggleOptions', () => {
    // Arrange
    const expectedOptions = [
      {
        i18nKey: 'buttons.toggle.lists',
        icon: 'list',
        label: 'Lists',
        value: './',
      },
      {
        i18nKey: 'buttons.toggle.graphs',
        icon: 'chart-pie',
        label: 'Graphs',
        value: 'graphs',
      },
    ];

    // Assert
    expect(component.pageToggleOptions).toEqual(expectedOptions);
  });
});
