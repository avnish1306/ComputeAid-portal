import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChalComponent } from './add-chal.component';

describe('AddChalComponent', () => {
  let component: AddChalComponent;
  let fixture: ComponentFixture<AddChalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
