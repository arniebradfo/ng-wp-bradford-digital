import { TestBed, inject } from '@angular/core/testing';

import { ViewModelService } from './view-model.service';

describe('ViewModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewModelService]
    });
  });

  it('should be created', inject([ViewModelService], (service: ViewModelService) => {
    expect(service).toBeTruthy();
  }));
});
