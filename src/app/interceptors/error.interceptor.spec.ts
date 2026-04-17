import { HttpInterceptorFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
    const interceptor: HttpInterceptorFn = (req, next) => 
        TestBed.runInInjectionContext(() => errorInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    test('should be created', () => {
        expect(interceptor).toBeTruthy();
    });
});