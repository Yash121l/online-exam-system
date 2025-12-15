export type ExamSession = {
  id: string;
  examId: string;
  candidateId?: string | null;
  candidateName: string;
  accessKey: string;
  status: string;
  startedAt?: string | null;
  endedAt?: string | null;
  exam?: {
    id: string;
    title: string;
    scheduling?: Record<string, any> | null;
    description?: string | null;
  };
};

export type ProctoringStatus = {
  cameraActive: boolean;
  micActive: boolean;
  screenActive: boolean;
  flags: string[];
  online: boolean;
  lastEventAt?: number;
};
