import localforage from 'localforage';

// Configure offline storage instances
const reportsStore = localforage.createInstance({
  name: 'HazardReporter',
  storeName: 'reports'
});

const mediaStore = localforage.createInstance({
  name: 'HazardReporter',
  storeName: 'media'
});

const syncQueueStore = localforage.createInstance({
  name: 'HazardReporter',
  storeName: 'syncQueue'
});

const userDataStore = localforage.createInstance({
  name: 'HazardReporter',
  storeName: 'userData'
});

export interface OfflineReport {
  id: string;
  type: string;
  severity: string;
  location: [number, number];
  title: string;
  description: string;
  mediaFiles: string[];
  timestamp: string;
  status: 'draft' | 'pending_sync' | 'synced' | 'failed';
  retryCount?: number;
  lastSyncAttempt?: string;
}

export interface MediaFile {
  id: string;
  reportId: string;
  filename: string;
  type: 'image' | 'video';
  base64Data: string;
  size: number;
  timestamp: string;
  synced: boolean;
}

export interface SyncQueueItem {
  id: string;
  type: 'report' | 'media' | 'user_data';
  data: any;
  timestamp: string;
  retryCount: number;
  lastAttempt?: string;
  error?: string;
}

// Reports operations
export const offlineReports = {
  async save(report: OfflineReport): Promise<void> {
    await reportsStore.setItem(report.id, report);
  },

  async get(id: string): Promise<OfflineReport | null> {
    return await reportsStore.getItem(id);
  },

  async getAll(): Promise<OfflineReport[]> {
    const reports: OfflineReport[] = [];
    await reportsStore.iterate((report: OfflineReport) => {
      reports.push(report);
    });
    return reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async getPendingSync(): Promise<OfflineReport[]> {
    const reports: OfflineReport[] = [];
    await reportsStore.iterate((report: OfflineReport) => {
      if (report.status === 'pending_sync' || report.status === 'failed') {
        reports.push(report);
      }
    });
    return reports;
  },

  async delete(id: string): Promise<void> {
    await reportsStore.removeItem(id);
  },

  async updateStatus(id: string, status: OfflineReport['status'], error?: string): Promise<void> {
    const report = await this.get(id);
    if (report) {
      report.status = status;
      report.lastSyncAttempt = new Date().toISOString();
      if (status === 'failed') {
        report.retryCount = (report.retryCount || 0) + 1;
      }
      await this.save(report);
    }
  }
};

// Media operations
export const offlineMedia = {
  async save(media: MediaFile): Promise<void> {
    await mediaStore.setItem(media.id, media);
  },

  async get(id: string): Promise<MediaFile | null> {
    return await mediaStore.getItem(id);
  },

  async getByReportId(reportId: string): Promise<MediaFile[]> {
    const mediaFiles: MediaFile[] = [];
    await mediaStore.iterate((media: MediaFile) => {
      if (media.reportId === reportId) {
        mediaFiles.push(media);
      }
    });
    return mediaFiles;
  },

  async getPendingSync(): Promise<MediaFile[]> {
    const mediaFiles: MediaFile[] = [];
    await mediaStore.iterate((media: MediaFile) => {
      if (!media.synced) {
        mediaFiles.push(media);
      }
    });
    return mediaFiles;
  },

  async delete(id: string): Promise<void> {
    await mediaStore.removeItem(id);
  },

  async markSynced(id: string): Promise<void> {
    const media = await this.get(id);
    if (media) {
      media.synced = true;
      await this.save(media);
    }
  }
};

// Sync queue operations
export const syncQueue = {
  async add(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const queueItem: SyncQueueItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      retryCount: 0
    };
    await syncQueueStore.setItem(queueItem.id, queueItem);
  },

  async getAll(): Promise<SyncQueueItem[]> {
    const items: SyncQueueItem[] = [];
    await syncQueueStore.iterate((item: SyncQueueItem) => {
      items.push(item);
    });
    return items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  async remove(id: string): Promise<void> {
    await syncQueueStore.removeItem(id);
  },

  async updateRetry(id: string, error: string): Promise<void> {
    const item = await syncQueueStore.getItem<SyncQueueItem>(id);
    if (item) {
      item.retryCount++;
      item.lastAttempt = new Date().toISOString();
      item.error = error;
      await syncQueueStore.setItem(id, item);
    }
  },

  async clear(): Promise<void> {
    await syncQueueStore.clear();
  }
};

// User data operations
export const offlineUserData = {
  async save(key: string, data: any): Promise<void> {
    await userDataStore.setItem(key, data);
  },

  async get<T>(key: string): Promise<T | null> {
    return await userDataStore.getItem(key);
  },

  async delete(key: string): Promise<void> {
    await userDataStore.removeItem(key);
  }
};

// Storage info
export const getStorageInfo = async () => {
  const reportsCount = (await offlineReports.getAll()).length;
  const mediaCount = (await offlineMedia.getPendingSync()).length;
  const queueCount = (await syncQueue.getAll()).length;
  
  return {
    reports: reportsCount,
    media: mediaCount,
    queueItems: queueCount
  };
};