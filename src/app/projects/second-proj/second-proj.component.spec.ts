import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondProjComponent } from './second-proj.component';

describe('SecondProjComponent', () => {
  let component: SecondProjComponent;
  let fixture: ComponentFixture<SecondProjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondProjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondProjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
