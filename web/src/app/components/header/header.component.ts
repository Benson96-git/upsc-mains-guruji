import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary">
      <div class="header-content">
        <div class="logo-section">
          <mat-icon>school</mat-icon>
          <span class="app-title">UPSC Question Generator</span>
        </div>
        <div class="version">v1.0.0</div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .app-title {
      font-size: 1.25rem;
      font-weight: 500;
    }
    .version {
      font-size: 0.875rem;
      opacity: 0.8;
    }
  `]
})
export class HeaderComponent { }