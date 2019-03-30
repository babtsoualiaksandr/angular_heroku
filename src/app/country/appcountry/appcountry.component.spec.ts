import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppcountryComponent } from './appcountry.component';

describe('AppcountryComponent', () => {
  let component: AppcountryComponent;
  let fixture: ComponentFixture<AppcountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppcountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppcountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
