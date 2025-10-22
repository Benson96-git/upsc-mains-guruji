import { Component, Input } from '@angular/core';
import { EditorialService, Question, AnswerResponse } from '../../services/editorial.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent {
  @Input() questions: Question[] = [];
  @Input() editorialText: string = '';

  generatingAnswers: { [key: string]: boolean } = {};
  answers: { [key: string]: string } = {};
  expandedPanels: { [key: string]: boolean } = {};

  constructor(
    private editorialService: EditorialService,
    private notification: NotificationService
  ) {}

  async generateAnswer(question: string, index: number) {
    this.generatingAnswers[question] = true;
    
    try {
      const response: any = await this.editorialService.generateAnswer(question, this.editorialText).toPromise();
      if (response?.success) {
        this.answers[question] = response.answer;
        this.expandedPanels[question] = true;
        this.notification.showSuccess('Answer generated successfully!');
      }
    } catch (error: any) {
      console.error('Error generating answer:', error);
      this.notification.showError(error.error?.error || 'Failed to generate answer');
    } finally {
      this.generatingAnswers[question] = false;
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.notification.showSuccess('Copied to clipboard!');
    });
  }

  formatAnswer(answer: string): string {
    return answer.replace(/\n/g, '<br>');
  }
}