import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchLater } from './watch-later';

describe('WatchLater', () => {
  let component: WatchLater;
  let fixture: ComponentFixture<WatchLater>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchLater],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchLater);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
