import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerViewerComponent } from './answer-viewer.component';

describe('AnswerViewerComponent', () => {
  let component: AnswerViewerComponent;
  let fixture: ComponentFixture<AnswerViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnswerViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
