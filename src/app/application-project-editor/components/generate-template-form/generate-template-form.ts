import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectEditorApi } from '@app/api/services/project-editor-api';
import { AIGenerationPayload } from '@app/api/types/ai';
import { AI_SYSTEM_PROMPT } from '@app/application-project-editor/ai/constants/ai-system-prompt';
import { DataAccess } from '@app/application-project-editor/services/data-access';
import { ApplicationEditorState } from '@app/application-project-editor/state/application-editor-state';
import { WidgetsState } from '@app/application-project-editor/state/widgets-state';

@Component({
  selector: 'de-generate-template-form',
  imports: [CommonModule, FormsModule],
  styleUrl: './generate-template-form.css',
  templateUrl: './generate-template-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateTemplateForm {
  private api = inject(ProjectEditorApi);
  private state = inject(ApplicationEditorState);
  private widgetsState = inject(WidgetsState);

  private dataAccess = inject(DataAccess);
  private router = inject(Router);

  get appState() {
    return this.state.appState;
  }

  // List of available industries for quick selection
  readonly industries = [
    { value: 'healthcare', label: '🏥 Healthcare', placeholder: 'dentistry, clinic...' },
    { value: 'grooming', label: '🐶 Grooming', placeholder: 'dog grooming, cat salon...' },
    {
      value: 'construction',
      label: '🏗 Construction',
      placeholder: 'apartment renovation, house building...',
    },
    { value: 'fintech', label: '💳 Fintech', placeholder: 'investments, crypto wallet...' },
    { value: 'ai', label: '🤖 AI Services', placeholder: 'neural networks, automation...' },
  ];

  // Visual styles / site moods
  readonly moods = [
    { value: 'modern', label: '⚡️ Tech and strict' },
    { value: 'friendly', label: '🌸 Soft and friendly' },
    { value: 'minimal', label: '🖤 Minimalist' },
  ];

  // Form state via Angular Signals
  selectedIndustry = signal<string>('healthcare');
  selectedMood = signal<string>('modern');
  userPrompt = signal<string>('');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Compute the placeholder based on the selected industry
  get currentPlaceholder(): string {
    const ind = this.industries.find((i) => i.value === this.selectedIndustry());
    return ind ? `e.g., ${ind.placeholder}` : 'Describe your business...';
  }

  async onSubmit() {
    if (!this.userPrompt().trim()) {
      this.errorMessage.set('Please describe your business');
      return;
    }

    // 1. Build the AI brief based on what the user entered
    const userRequest = `
  Generate a site for the industry: ${this.selectedIndustry()}.
  Visual style/mood: ${this.selectedMood()}.
  Business description and special requests: ${this.userPrompt()}.
`;

    // 2. Pack the system prompt and request into a single object
    const body: AIGenerationPayload = {
      systemInstruction: AI_SYSTEM_PROMPT,
      prompt: userRequest,
    };

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Send the request to our future NestJS backend
    this.api.generatePageAI(body).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        console.log('Generated JSON from AI:', response);

        const newTemplate = this.dataAccess.createTemplate(response, 'ai-generated');

        this.widgetsState.addTemplate(newTemplate);

        this.state.resetAppState();
        this.dataAccess.renderByTemplate(newTemplate);
        this.router.navigate(['/project', '1', 'page', 'page-1']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Generation error. Please try again.');
        console.error(err);
      },
    });
  }
}
