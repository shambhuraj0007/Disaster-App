import { create } from 'zustand';

export interface HazardReport {
  id: string;
  userId: string;
  hazardType: 'tsunami' | 'cyclone' | 'earthquake' | 'flood' | 'landslide';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  media: string[];
  timestamp: Date;
  status: 'draft' | 'submitted' | 'verified' | 'resolved';
  userInfo?: {
    name: string;
    avatar?: string;
  };
}

interface ReportState {
  reports: HazardReport[];
  currentReport: Partial<HazardReport> | null;
  addReport: (report: HazardReport) => void;
  updateReport: (id: string, updates: Partial<HazardReport>) => void;
  setCurrentReport: (report: Partial<HazardReport> | null) => void;
  deleteReport: (id: string) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  currentReport: null,
  addReport: (report) =>
    set((state) => ({ reports: [...state.reports, report] })),
  updateReport: (id, updates) =>
    set((state) => ({
      reports: state.reports.map((report) =>
        report.id === id ? { ...report, ...updates } : report
      ),
    })),
  setCurrentReport: (report) => set({ currentReport: report }),
  deleteReport: (id) =>
    set((state) => ({
      reports: state.reports.filter((report) => report.id !== id),
    })),
}));