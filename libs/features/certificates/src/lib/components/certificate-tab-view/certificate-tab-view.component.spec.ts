import { CertificateTabViewComponent } from './certificate-tab-view.component';

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

describe('CertificateTabViewComponent', () => {
  let component: CertificateTabViewComponent;

  beforeEach(async () => {
    component = new CertificateTabViewComponent();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
