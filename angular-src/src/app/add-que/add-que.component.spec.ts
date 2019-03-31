import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQueComponent } from './add-que.component';

describe('AddQueComponent', () => {
  let component: AddQueComponent;
  let fixture: ComponentFixture<AddQueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddQueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
