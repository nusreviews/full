import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleReviewFormComponent } from './module-review-form.component';

describe('ModuleReviewFormComponent', () => {
  let component: ModuleReviewFormComponent;
  let fixture: ComponentFixture<ModuleReviewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleReviewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
