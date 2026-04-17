import { createWindowResizerMock } from '../../__mocks__/window-resizer.mock';
import { FindingTabViewComponent } from './finding-tab-view.component';

createWindowResizerMock();

describe('FindingTabViewComponent', () => {
  let component: FindingTabViewComponent;

  jest.mock('primeng/api', () => ({
    ConfirmationService: jest.fn().mockImplementation(() => ({
      confirm: jest.fn(),
    })),
  }));

  beforeEach(async () => {
    component = new FindingTabViewComponent();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
