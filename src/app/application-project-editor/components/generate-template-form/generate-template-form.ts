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

  // Список доступных индустрий для быстрого выбора
  readonly industries = [
    { value: 'healthcare', label: '🏥 Медицина', placeholder: 'стоматология, клиника...' },
    { value: 'grooming', label: '🐶 Груминг', placeholder: 'стрижка собак, салон для кошек...' },
    {
      value: 'construction',
      label: '🏗 Строительство',
      placeholder: 'ремонт квартир, постройка домов...',
    },
    { value: 'fintech', label: '💳 Финтех', placeholder: 'инвестиции, крипто-кошелек...' },
    { value: 'ai', label: '🤖 AI Сервисы', placeholder: 'нейросети, автоматизация...' },
  ];

  // Визуальные стили / настроения сайта
  readonly moods = [
    { value: 'modern', label: '⚡️ Технологичный и строгий' },
    { value: 'friendly', label: '🌸 Мягкий и дружелюбный' },
    { value: 'minimal', label: '🖤 Минимализм' },
  ];

  // Состояние формы через Angular Signals
  selectedIndustry = signal<string>('healthcare');
  selectedMood = signal<string>('modern');
  userPrompt = signal<string>('');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Вычисляем плейсхолдер в зависимости от выбранной индустрии
  get currentPlaceholder(): string {
    const ind = this.industries.find((i) => i.value === this.selectedIndustry());
    return ind ? `Например: ${ind.placeholder}` : 'Опишите ваш бизнес...';
  }

  async onSubmit() {
    if (!this.userPrompt().trim()) {
      this.errorMessage.set('Пожалуйста, опишите ваш бизнес');
      return;
    }

    // 1. Формируем ТЗ для ИИ на основе того, что ввел пользователь
    const userRequest = `
  Сгенерируй сайт для индустрии: ${this.selectedIndustry()}.
  Визуальный стиль/настроение: ${this.selectedMood()}.
  Описание бизнеса и особые пожелания: ${this.userPrompt()}.
`;

    // 2. Упаковываем системный промпт и запрос в один объект
    const body: AIGenerationPayload = {
      systemInstruction: AI_SYSTEM_PROMPT,
      prompt: userRequest,
    };

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Отправляем запрос на наш будущий NestJS бэкенд
    this.api.generatePageAI(body).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        console.log('Сгенерированный JSON от AI:', response);

        const newTemplate = this.dataAccess.createAiTemplate(response);

        this.widgetsState.addTemplate(newTemplate);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Ошибка при генерации. Попробуйте еще раз.');
        console.error(err);
      },
    });
  }
}
