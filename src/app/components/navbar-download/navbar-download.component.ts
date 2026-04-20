import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Popover, PopoverModule } from 'primeng/popover';

import {
  DocumentDownloadTask,
  DocumentQueueService,
} from '@erp-services/data-access/documents/services';

import { NavbarButtonComponent } from '../navbar-button';

@Component({
  selector: 'erp-services-navbar-download',
  imports: [
    CommonModule,
    TranslocoDirective,
    PopoverModule,
    NavbarButtonComponent,
  ],
  templateUrl: './navbar-download.component.html',
  styleUrl: './navbar-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarDownloadComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  downloadTasks: DocumentDownloadTask[] = [];
  downloadCount = 0;

  get downloadIcon(): string {
    return this.downloadTasks.some((task) => task.status === 'downloading')
      ? 'spinner pi-spin'
      : 'download';
  }

  get badgeCounter(): number {
    return this.downloadTasks.some((task) => task.status === 'downloading')
      ? 0
      : this.downloadCount;
  }

  constructor(
    private ts: TranslocoService,
    private documentQueueService: DocumentQueueService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.documentQueueService.downloadTasks$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tasks) => {
        this.downloadTasks = tasks;
        this.downloadCount = tasks.length;
        this.cdr.markForCheck();
      });
  }

  onToggleDownloadOverlay(popover: Popover, event: MouseEvent): void {
    popover.toggle(event);
  }
}
