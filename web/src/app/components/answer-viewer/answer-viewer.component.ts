import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-answer-viewer',
  template: `
    <div class="answer-container" *ngIf="answer">
      <h4>Model Answer</h4>
      <div class="answer-content">
        {{ answer }}
      </div>
      <div class="answer-meta" *ngIf="wordCount">
        <small>Approx. {{ wordCount }} words</small>
      </div>
    </div>
  `,
  styles: [`
    .answer-container {
      margin-top: 16px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .answer-content {
      white-space: pre-wrap;
      line-height: 1.6;
    }
    .answer-meta {
      margin-top: 8px;
      text-align: right;
      color: #666;
    }
  `]
})
export class AnswerViewerComponent {
  @Input() answer: string = '';
  @Input() question: string = '';
  @Input() wordCount: number = 0;
}