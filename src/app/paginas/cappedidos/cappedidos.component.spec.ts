import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CappedidosComponent } from './cappedidos.component';

describe('CappedidosComponent', () => {
  let component: CappedidosComponent;
  let fixture: ComponentFixture<CappedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CappedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CappedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
