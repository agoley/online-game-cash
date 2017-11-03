import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareHeroComponent } from './square-hero.component';

describe('SquareHeroComponent', () => {
  let component: SquareHeroComponent;
  let fixture: ComponentFixture<SquareHeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquareHeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
