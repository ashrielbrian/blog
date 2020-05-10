import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GapminderComponent } from './gapminder.component';

describe('GapminderComponent', () => {
  let component: GapminderComponent;
  let fixture: ComponentFixture<GapminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GapminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GapminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
