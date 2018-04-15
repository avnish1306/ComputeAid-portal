import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalsComponent } from './chals.component';

describe('ChalsComponent', () => {
  let component: ChalsComponent;
  let fixture: ComponentFixture<ChalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
