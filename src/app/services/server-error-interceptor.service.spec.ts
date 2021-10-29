import { TestBed } from '@angular/core/testing';

import { ServerErrorInterceptorService } from './server-error-interceptor.service';

describe('ServerErrorInterceptorService', () => {
  let service: ServerErrorInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerErrorInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
