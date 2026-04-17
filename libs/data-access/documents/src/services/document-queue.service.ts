import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  finalize,
  map,
  Observable,
  of,
  Subject,
  tap,
} from 'rxjs';

import {
  decodeDownloadFileName,
  downloadFromByteArray,
} from '@customer-portal/shared/helpers/download';

export interface DocumentDownloadTask {
  id: string;
  name: string;
  type: string;
  fileName: string;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  progress: number;
  data?: any;
  blob?: Blob;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

type DownloadHandler = (
  data: any,
  fileName: string,
) => Observable<{ blob: Blob; fileName: string }>;

@Injectable({ providedIn: 'root' })
export class DocumentQueueService implements OnDestroy {
  private downloadQueue: DocumentDownloadTask[] = [];
  private queueSubject = new BehaviorSubject<DocumentDownloadTask[]>([]);
  private downloadSubject = new Subject<{
    taskId: string;
    type: string;
    fileName: string;
    data: any;
  }>();
  private maxConcurrentDownloads = 5;
  private activeDownloads = 0;

  private downloadHandlers: Record<string, DownloadHandler> = {};

  constructor() {
    this.initializeDownloadProcessor();
  }

  get downloadTasks$(): Observable<DocumentDownloadTask[]> {
    return this.queueSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.downloadSubject.complete();
    this.queueSubject.complete();
  }

  addDownloadTask(
    type: string,
    name: string,
    fileName: string,
    data: any,
  ): string {
    const taskId = this.generateTaskId();
    const task: DocumentDownloadTask = {
      id: taskId,
      name,
      type,
      fileName,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      data,
    };
    this.downloadQueue.push(task);
    this.queueSubject.next([...this.downloadQueue]);
    this.downloadSubject.next({ taskId, type, fileName, data });

    return taskId;
  }

  registerDownloadHandler(type: string, handler: DownloadHandler): void {
    this.downloadHandlers[type] = handler;
  }

  removeTask(taskId: string): void {
    this.downloadQueue = this.downloadQueue.filter(
      (task) => task.id !== taskId,
    );
    this.queueSubject.next([...this.downloadQueue]);
  }

  clearCompletedTasks(): void {
    this.downloadQueue = this.downloadQueue.filter(
      (task) => task.status !== 'completed' && task.status !== 'failed',
    );
    this.queueSubject.next([...this.downloadQueue]);
  }

  getTaskObservable(
    taskId: string,
  ): Observable<DocumentDownloadTask | undefined> {
    return this.queueSubject.pipe(
      map((tasks) => tasks.find((task) => task.id === taskId)),
    );
  }

  extractFileName(contentDisposition: string): string {
    return contentDisposition
      .split(';')
      .map((x) => x.trim())
      .filter((y) => y.startsWith('filename='))
      .map((z) => z.replace('filename=', '').replace(/"/g, ''))
      .reduce((z) => z);
  }

  private initializeDownloadProcessor(): void {
    this.downloadSubject
      .pipe(
        concatMap(({ taskId, type, fileName, data }) =>
          this.waitForAvailableSlot().pipe(
            concatMap(() => this.processDownload(taskId, type, fileName, data)),
          ),
        ),
      )
      .subscribe();
  }

  private waitForAvailableSlot(): Observable<void> {
    return new Observable<void>((subscriber) => {
      const checkSlot = () => {
        if (this.activeDownloads < this.maxConcurrentDownloads) {
          this.activeDownloads += 1;
          subscriber.next();
          subscriber.complete();
        } else {
          setTimeout(checkSlot, 100);
        }
      };
      checkSlot();
    });
  }

  private processDownload(
    taskId: string,
    type: string,
    fileName: string,
    data: any,
  ): Observable<void> {
    this.updateTaskStatus(taskId, 'downloading', 0);

    let progress = 0;

    const simulateProgress = () => {
      if (progress < 95) {
        progress += Math.floor(Math.random() * 20) + 20;
        if (progress > 95) progress = 95;
        this.updateTaskProgress(taskId, progress);
        setTimeout(simulateProgress, 200);
      }
    };
    simulateProgress();

    const handler = this.downloadHandlers[type];

    if (!handler) {
      this.updateTaskStatus(
        taskId,
        'failed',
        0,
        undefined,
        'No handler registered for this download type',
      );

      return of(undefined);
    }

    return handler(data, fileName).pipe(
      tap(({ blob, fileName: actualFileName }) => {
        const decodedFileName = decodeDownloadFileName(
          actualFileName || fileName,
        );
        const task = this.downloadQueue.find((t) => t.id === taskId);

        if (task && decodedFileName) {
          task.fileName = decodedFileName;
          this.queueSubject.next([...this.downloadQueue]);
        }
        downloadFromByteArray({ body: blob }, decodedFileName);
        this.updateTaskStatus(taskId, 'completed', 100, blob ?? undefined);
      }),
      catchError((error) => {
        this.updateTaskStatus(
          taskId,
          'failed',
          0,
          undefined,
          error?.message || 'Download failed',
        );

        return of(undefined);
      }),
      finalize(() => {
        this.activeDownloads -= 1;
      }),
      map(() => undefined),
    );
  }

  private updateTaskStatus(
    taskId: string,
    status: DocumentDownloadTask['status'],
    progress: number,
    blob?: Blob,
    error?: string,
  ): void {
    const task = this.downloadQueue.find((t) => t.id === taskId);

    if (task) {
      task.status = status;
      task.progress = progress;
      if (blob) task.blob = blob;
      if (error) task.error = error;

      if (status === 'completed' || status === 'failed') {
        task.completedAt = new Date();
      }
      this.queueSubject.next([...this.downloadQueue]);
    }
  }

  private updateTaskProgress(taskId: string, progress: number): void {
    const task = this.downloadQueue.find((t) => t.id === taskId);

    if (task && task.status === 'downloading') {
      task.progress = progress;
      this.queueSubject.next([...this.downloadQueue]);
    }
  }

  private generateTaskId(): string {
    return `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
