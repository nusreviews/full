import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbLoginModalComponent } from './fb-login-modal.component';

describe('FbLoginModalComponent', () => {
  let component: FbLoginModalComponent;
  let fixture: ComponentFixture<FbLoginModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbLoginModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbLoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
