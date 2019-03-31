import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFlawComponent } from './add-flaw.component';

describe('AddFlawComponent', () => {
  let component: AddFlawComponent;
  let fixture: ComponentFixture<AddFlawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFlawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFlawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
