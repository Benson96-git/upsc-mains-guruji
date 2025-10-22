import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditorialService, Question } from '../../services/editorial.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-editorial-processor',
  templateUrl: './editorial-processor.component.html',
  styleUrls: ['./editorial-processor.component.scss']
})
export class EditorialProcessorComponent {
  editorialForm: FormGroup;
  isLoading = false;
  isExtracting = false;
  isGeneratingQuestions = false;
  
  editorialText = '';
  wordCount = 0;
  questions: Question[] = [];
  
  sampleUrls = [
    { name: 'The Hindu Editorial', url: 'https://www.thehindu.com/opinion/editorial/' },
    { name: 'Indian Express Editorial', url: 'https://indianexpress.com/section/editorials/' }
  ];

  constructor(
    private fb: FormBuilder,
    private editorialService: EditorialService,
    private notification: NotificationService
  ) {
    this.editorialForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  async extractEditorial() {
    if (this.editorialForm.valid) {
      this.isLoading = true;
      this.isExtracting = true;
      const url = this.editorialForm.get('url')?.value;

      try {
        const response = await this.editorialService.extractEditorial(url).toPromise();
        if (response?.success) {
          this.editorialText = response.editorial;
          this.wordCount = response.wordCount;
          this.notification.showSuccess('Editorial extracted successfully!');
        }
      } catch (error: any) {
        console.error('Error extracting editorial:', error);
        this.notification.showError(error.error?.error || 'Failed to extract editorial');
      } finally {
        this.isLoading = false;
        this.isExtracting = false;
      }
    }
  }

  async generateQuestions() {
    if (!this.editorialText) {
      this.notification.showError('Please extract editorial content first');
      return;
    }

    this.isLoading = true;
    this.isGeneratingQuestions = true;

    try {
      const response = await this.editorialService.generateQuestions(this.editorialText).toPromise();
      if (response?.success) {
        this.questions = response.questions;
        this.notification.showSuccess(`Generated ${this.questions.length} UPSC questions!`);
      }
    } catch (error: any) {
      console.error('Error generating questions:', error);
      this.notification.showError(error.error?.error || 'Failed to generate questions');
    } finally {
      this.isLoading = false;
      this.isGeneratingQuestions = false;
    }
  }

  useSampleUrl(sampleUrl: string) {
    this.editorialForm.patchValue({ url: sampleUrl });
  }

  resetForm() {
    this.editorialForm.reset();
    this.editorialText = '';
    this.questions = [];
    this.wordCount = 0;
  }
}