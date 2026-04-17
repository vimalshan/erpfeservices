import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs';
import { environment } from '@customer-portal/environments';
import { customHeaderInterceptor } from './custom-header.interceptor';

describe('CustomHeaderInterceptor', () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([customHeaderInterceptor])),
                provideHttpClientTesting(),
            ],
        });

        httpClient = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    test('should add Ocp-Apim-Subscription-Key to the headers', () => {
        const testUrl = '/test.url';
        const expectedHeaderValue = environment.apimKey;

        httpClient.get(testUrl).pipe(take(1)).subscribe();

        const req = httpMock.expectOne(testUrl);
        expect(req.request.headers.has('Ocp-Apim-Subscription-Key')).toBe(true);
        expect(req.request.headers.get('Ocp-Apim-Subscription-Key')).toBe(expectedHeaderValue);
        req.flush({});
    });

    test('should forward the request without modifying other headers', () => {
        const testUrl = '/test.url';
        const expectedHeaderValue = environment.apimKey;
        const otherHeader = 'Custom-Header';
        const otherHeaderValue = 'customValue';

        httpClient
            .get(testUrl, { headers: { [otherHeader]: otherHeaderValue } })
            .pipe(take(1))
            .subscribe();

        const req = httpMock.expectOne(testUrl);
        expect(req.request.headers.has('Ocp-Apim-Subscription-Key')).toBe(true);
        expect(req.request.headers.get('Ocp-Apim-Subscription-Key')).toBe(expectedHeaderValue);
        expect(req.request.headers.has(otherHeader)).toBe(true);
        expect(req.request.headers.get(otherHeader)).toBe(otherHeaderValue);
        req.flush({});
    });
});