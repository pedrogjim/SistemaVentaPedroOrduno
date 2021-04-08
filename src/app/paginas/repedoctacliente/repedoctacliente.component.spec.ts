import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepedoctaclienteComponent } from './repedoctacliente.component';

describe('RepedoctaclienteComponent', () => {
  let component: RepedoctaclienteComponent;
  let fixture: ComponentFixture<RepedoctaclienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepedoctaclienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepedoctaclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
