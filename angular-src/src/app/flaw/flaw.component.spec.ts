import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlawComponent } from './flaw.component';

describe('FlawComponent', () => {
  let component: FlawComponent;
  let fixture: ComponentFixture<FlawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
