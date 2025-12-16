import { ExamsService } from '../exams/exams.service';

const createLoggerMock = () =>
  ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  } as unknown);

describe('ExamsService', () => {
  it('calculates grades with breakdown', () => {
    const prismaMock = {
      exam: {
        create: jest.fn(async ({ data }) => ({ ...data })),
        findUnique: jest.fn()
      }
    };
    const storageMock = {
      generateUploadUrl: jest.fn()
    };
    const service = new ExamsService(createLoggerMock() as any, prismaMock as any, storageMock as any);

    const result = service.gradeExam({
      answers: [
        { questionId: 'q1', submittedAnswer: 'A' },
        { questionId: 'q2', submittedAnswer: 'false' }
      ],
      answerKey: [
        { questionId: 'q1', correctAnswer: 'A', points: 2 },
        { questionId: 'q2', correctAnswer: 'true', points: 3 }
      ],
      candidateId: 'user-1'
    });

    expect(result.totalPoints).toBe(5);
    expect(result.earnedPoints).toBe(2);
    expect(result.breakdown.find((b) => b.questionId === 'q1')?.correct).toBe(true);
    expect(result.breakdown.find((b) => b.questionId === 'q2')?.correct).toBe(false);
    expect(result.percentage).toBeCloseTo(40);
  });
});
