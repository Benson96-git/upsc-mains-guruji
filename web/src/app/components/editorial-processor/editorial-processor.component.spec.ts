import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialProcessorComponent } from './editorial-processor.component';

describe('EditorialProcessorComponent', () => {
  let component: EditorialProcessorComponent;
  let fixture: ComponentFixture<EditorialProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorialProcessorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorialProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
