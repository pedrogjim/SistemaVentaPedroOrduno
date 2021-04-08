import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapventasexpComponent } from './capventasexp.component';

describe('CapventasexpComponent', () => {
  let component: CapventasexpComponent;
  let fixture: ComponentFixture<CapventasexpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapventasexpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapventasexpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
