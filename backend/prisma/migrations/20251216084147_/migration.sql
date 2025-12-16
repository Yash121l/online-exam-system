-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'EVALUATOR', 'STUDENT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ_SINGLE', 'MCQ_MULTIPLE', 'TRUE_FALSE', 'SHORT_ANSWER', 'LONG_ANSWER', 'ESSAY', 'CODE_SNIPPET', 'FILL_IN_BLANK', 'MATCHING', 'ORDERING', 'DIAGRAM', 'SCAN_UPLOAD', 'FILE_UPLOAD', 'DRAG_DROP', 'HOTSPOT', 'AUDIO_RESPONSE', 'VIDEO_RESPONSE', 'MATH_EQUATION', 'NUMERICAL', 'MATRIX', 'ASSERTION_REASON', 'CLOZE_TEST', 'CASE_STUDY', 'SIMULATION', 'PEER_ASSESSMENT');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('VERY_EASY', 'EASY', 'MEDIUM', 'HARD', 'VERY_HARD');

-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'ARCHIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('PRACTICE', 'QUIZ', 'MIDTERM', 'FINAL', 'CERTIFICATION', 'PLACEMENT', 'MOCK_TEST', 'ASSIGNMENT');

-- CreateEnum
CREATE TYPE "ProctoringLevel" AS ENUM ('NONE', 'BASIC', 'ADVANCED', 'AI_ASSISTED');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'AUTO_SUBMITTED', 'GRADED', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "ProctorEventType" AS ENUM ('SESSION_START', 'SESSION_END', 'FACE_NOT_DETECTED', 'MULTIPLE_FACES', 'FACE_OBSCURED', 'LOOKING_AWAY', 'OBJECT_DETECTED', 'AUDIO_DETECTED', 'TAB_SWITCH', 'WINDOW_BLUR', 'FULLSCREEN_EXIT', 'COPY_PASTE', 'KEYBOARD_SHORTCUT', 'PROHIBITED_SOFTWARE', 'NETWORK_DISCONNECT', 'SUSPICIOUS_ACTIVITY', 'MANUAL_FLAG');

-- CreateEnum
CREATE TYPE "ProctorSeverity" AS ENUM ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REVIEWED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EXAM_ASSIGNED', 'EXAM_REMINDER', 'EXAM_STARTED', 'EXAM_SUBMITTED', 'GRADE_PUBLISHED', 'PROCTORING_ALERT', 'SYSTEM_ALERT', 'MESSAGE');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('USER_LOGIN', 'USER_LOGOUT', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'EXAM_CREATED', 'EXAM_UPDATED', 'EXAM_DELETED', 'EXAM_PUBLISHED', 'EXAM_STARTED', 'EXAM_SUBMITTED', 'QUESTION_CREATED', 'QUESTION_UPDATED', 'QUESTION_DELETED', 'PROCTORING_FLAG', 'GRADE_PUBLISHED', 'EVALUATION_COMPLETED', 'SETTINGS_CHANGED', 'SECURITY_VIOLATION');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "avatar" TEXT,
    "phoneNumber" TEXT,
    "organizationId" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "logo" TEXT,
    "address" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "subscriptionPlan" TEXT,
    "subscriptionExpiry" TIMESTAMP(3),
    "maxUsers" INTEGER,
    "maxExams" INTEGER,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_banks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "questionBankId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionMediaUrls" TEXT[],
    "answerConfig" JSONB NOT NULL,
    "correctAnswer" JSONB,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "negativeMarking" DOUBLE PRECISION DEFAULT 0,
    "partialCredit" BOOLEAN NOT NULL DEFAULT false,
    "subject" TEXT,
    "topic" TEXT,
    "learningObjective" TEXT,
    "bloomsTaxonomy" TEXT,
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "avgDifficulty" DOUBLE PRECISION,
    "discriminationIndex" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_tags" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "question_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_bank_tags" (
    "id" TEXT NOT NULL,
    "questionBankId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "question_bank_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "examType" "ExamType" NOT NULL,
    "status" "ExamStatus" NOT NULL DEFAULT 'DRAFT',
    "creatorId" TEXT NOT NULL,
    "organizationId" TEXT,
    "scheduledStartTime" TIMESTAMP(3),
    "scheduledEndTime" TIMESTAMP(3),
    "duration" INTEGER,
    "accessCode" TEXT,
    "requireSecureClient" BOOLEAN NOT NULL DEFAULT false,
    "allowedIpRanges" TEXT[],
    "config" JSONB NOT NULL,
    "proctoringLevel" "ProctoringLevel" NOT NULL DEFAULT 'NONE',
    "proctoringConfig" JSONB,
    "allowedTools" TEXT[],
    "enableTextToSpeech" BOOLEAN NOT NULL DEFAULT false,
    "compensatoryTime" INTEGER,
    "totalPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "passingScore" DOUBLE PRECISION,
    "gradingType" TEXT NOT NULL DEFAULT 'AUTOMATIC',
    "sourcePdfUrl" TEXT,
    "pdfQuestionMap" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_sections" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "duration" INTEGER,

    CONSTRAINT "exam_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_questions" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "sectionId" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "points" DOUBLE PRECISION,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_assignments" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "extraTime" INTEGER,
    "specialAccess" JSONB,

    CONSTRAINT "exam_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_attempts" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "status" "AttemptStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "timeSpent" INTEGER,
    "score" DOUBLE PRECISION,
    "maxScore" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "isPassed" BOOLEAN,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceFingerprint" TEXT,
    "securityFlags" JSONB,
    "integrityScore" DOUBLE PRECISION,
    "flaggedForReview" BOOLEAN NOT NULL DEFAULT false,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "examQuestionId" TEXT NOT NULL,
    "answer" JSONB NOT NULL,
    "answerMediaUrls" TEXT[],
    "isMarkedForReview" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER,
    "attemptCount" INTEGER NOT NULL DEFAULT 1,
    "isCorrect" BOOLEAN,
    "pointsAwarded" DOUBLE PRECISION,
    "feedback" TEXT,
    "firstAnsweredAt" TIMESTAMP(3),
    "lastAnsweredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proctoring_sessions" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "sessionStartTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionEndTime" TIMESTAMP(3),
    "videoRecordingUrl" TEXT,
    "screenRecordingUrl" TEXT,
    "totalFlags" INTEGER NOT NULL DEFAULT 0,
    "criticalFlags" INTEGER NOT NULL DEFAULT 0,
    "overallRiskScore" DOUBLE PRECISION,

    CONSTRAINT "proctoring_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proctoring_events" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventType" "ProctorEventType" NOT NULL,
    "severity" "ProctorSeverity" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "metadata" JSONB,
    "snapshotUrl" TEXT,
    "aiConfidence" DOUBLE PRECISION,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "isFalsePositive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "proctoring_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proctoring_snapshots" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "webcamImageUrl" TEXT,
    "screenImageUrl" TEXT,
    "analysisResults" JSONB,

    CONSTRAINT "proctoring_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "evaluatorId" TEXT,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "totalScore" DOUBLE PRECISION,
    "adjustedScore" DOUBLE PRECISION,
    "overallFeedback" TEXT,
    "privateNotes" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_analytics" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "totalAssigned" INTEGER NOT NULL DEFAULT 0,
    "totalStarted" INTEGER NOT NULL DEFAULT 0,
    "totalCompleted" INTEGER NOT NULL DEFAULT 0,
    "avgScore" DOUBLE PRECISION,
    "medianScore" DOUBLE PRECISION,
    "highestScore" DOUBLE PRECISION,
    "lowestScore" DOUBLE PRECISION,
    "stdDeviation" DOUBLE PRECISION,
    "avgTimeSpent" INTEGER,
    "avgDifficulty" DOUBLE PRECISION,
    "reliabilityIndex" DOUBLE PRECISION,
    "questionStats" JSONB,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_performance_reports" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "percentile" DOUBLE PRECISION,
    "rank" INTEGER,
    "strengthAreas" TEXT[],
    "weaknessAreas" TEXT[],
    "recommendations" TEXT,
    "totalTimeSpent" INTEGER NOT NULL,
    "avgTimePerQuestion" DOUBLE PRECISION,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_performance_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "examId" TEXT,
    "message" TEXT NOT NULL,
    "attachmentUrls" TEXT[],
    "isSystemMessage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "activityType" "ActivityType" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploads" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Url" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_passwordResetToken_key" ON "users"("passwordResetToken");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_organizationId_idx" ON "users"("organizationId");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_domain_key" ON "organizations"("domain");

-- CreateIndex
CREATE INDEX "question_banks_organizationId_idx" ON "question_banks"("organizationId");

-- CreateIndex
CREATE INDEX "questions_questionBankId_idx" ON "questions"("questionBankId");

-- CreateIndex
CREATE INDEX "questions_type_idx" ON "questions"("type");

-- CreateIndex
CREATE INDEX "questions_difficulty_idx" ON "questions"("difficulty");

-- CreateIndex
CREATE INDEX "questions_subject_idx" ON "questions"("subject");

-- CreateIndex
CREATE INDEX "question_tags_tag_idx" ON "question_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "question_tags_questionId_tag_key" ON "question_tags"("questionId", "tag");

-- CreateIndex
CREATE INDEX "question_bank_tags_tag_idx" ON "question_bank_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "question_bank_tags_questionBankId_tag_key" ON "question_bank_tags"("questionBankId", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "exams_accessCode_key" ON "exams"("accessCode");

-- CreateIndex
CREATE INDEX "exams_creatorId_idx" ON "exams"("creatorId");

-- CreateIndex
CREATE INDEX "exams_organizationId_idx" ON "exams"("organizationId");

-- CreateIndex
CREATE INDEX "exams_status_idx" ON "exams"("status");

-- CreateIndex
CREATE INDEX "exams_scheduledStartTime_scheduledEndTime_idx" ON "exams"("scheduledStartTime", "scheduledEndTime");

-- CreateIndex
CREATE INDEX "exams_accessCode_idx" ON "exams"("accessCode");

-- CreateIndex
CREATE INDEX "exam_sections_examId_idx" ON "exam_sections"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_sections_examId_orderIndex_key" ON "exam_sections"("examId", "orderIndex");

-- CreateIndex
CREATE INDEX "exam_questions_examId_idx" ON "exam_questions"("examId");

-- CreateIndex
CREATE INDEX "exam_questions_questionId_idx" ON "exam_questions"("questionId");

-- CreateIndex
CREATE INDEX "exam_questions_sectionId_idx" ON "exam_questions"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_questions_examId_questionId_key" ON "exam_questions"("examId", "questionId");

-- CreateIndex
CREATE INDEX "exam_assignments_examId_idx" ON "exam_assignments"("examId");

-- CreateIndex
CREATE INDEX "exam_assignments_studentId_idx" ON "exam_assignments"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_assignments_examId_studentId_key" ON "exam_assignments"("examId", "studentId");

-- CreateIndex
CREATE INDEX "exam_attempts_examId_idx" ON "exam_attempts"("examId");

-- CreateIndex
CREATE INDEX "exam_attempts_studentId_idx" ON "exam_attempts"("studentId");

-- CreateIndex
CREATE INDEX "exam_attempts_status_idx" ON "exam_attempts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "exam_attempts_examId_studentId_attemptNumber_key" ON "exam_attempts"("examId", "studentId", "attemptNumber");

-- CreateIndex
CREATE INDEX "responses_attemptId_idx" ON "responses"("attemptId");

-- CreateIndex
CREATE INDEX "responses_examQuestionId_idx" ON "responses"("examQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "responses_attemptId_examQuestionId_key" ON "responses"("attemptId", "examQuestionId");

-- CreateIndex
CREATE INDEX "proctoring_sessions_attemptId_idx" ON "proctoring_sessions"("attemptId");

-- CreateIndex
CREATE INDEX "proctoring_sessions_studentId_idx" ON "proctoring_sessions"("studentId");

-- CreateIndex
CREATE INDEX "proctoring_events_sessionId_idx" ON "proctoring_events"("sessionId");

-- CreateIndex
CREATE INDEX "proctoring_events_eventType_severity_idx" ON "proctoring_events"("eventType", "severity");

-- CreateIndex
CREATE INDEX "proctoring_events_timestamp_idx" ON "proctoring_events"("timestamp");

-- CreateIndex
CREATE INDEX "proctoring_snapshots_sessionId_idx" ON "proctoring_snapshots"("sessionId");

-- CreateIndex
CREATE INDEX "proctoring_snapshots_timestamp_idx" ON "proctoring_snapshots"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_attemptId_key" ON "evaluations"("attemptId");

-- CreateIndex
CREATE INDEX "evaluations_attemptId_idx" ON "evaluations"("attemptId");

-- CreateIndex
CREATE INDEX "evaluations_evaluatorId_idx" ON "evaluations"("evaluatorId");

-- CreateIndex
CREATE INDEX "evaluations_status_idx" ON "evaluations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "exam_analytics_examId_key" ON "exam_analytics"("examId");

-- CreateIndex
CREATE INDEX "student_performance_reports_studentId_idx" ON "student_performance_reports"("studentId");

-- CreateIndex
CREATE INDEX "student_performance_reports_examId_idx" ON "student_performance_reports"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "student_performance_reports_studentId_examId_key" ON "student_performance_reports"("studentId", "examId");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "chat_messages_senderId_idx" ON "chat_messages"("senderId");

-- CreateIndex
CREATE INDEX "chat_messages_examId_createdAt_idx" ON "chat_messages"("examId", "createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "activity_logs_activityType_idx" ON "activity_logs"("activityType");

-- CreateIndex
CREATE INDEX "activity_logs_timestamp_idx" ON "activity_logs"("timestamp");

-- CreateIndex
CREATE INDEX "activity_logs_entityType_entityId_idx" ON "activity_logs"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "system_config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "file_uploads_s3Key_key" ON "file_uploads"("s3Key");

-- CreateIndex
CREATE INDEX "file_uploads_entityType_entityId_idx" ON "file_uploads"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "file_uploads_uploadedBy_idx" ON "file_uploads"("uploadedBy");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_tags" ADD CONSTRAINT "question_tags_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_bank_tags" ADD CONSTRAINT "question_bank_tags_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_sections" ADD CONSTRAINT "exam_sections_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "exam_sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_assignments" ADD CONSTRAINT "exam_assignments_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_assignments" ADD CONSTRAINT "exam_assignments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "exam_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_examQuestionId_fkey" FOREIGN KEY ("examQuestionId") REFERENCES "exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proctoring_sessions" ADD CONSTRAINT "proctoring_sessions_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "exam_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proctoring_sessions" ADD CONSTRAINT "proctoring_sessions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proctoring_events" ADD CONSTRAINT "proctoring_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "proctoring_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proctoring_snapshots" ADD CONSTRAINT "proctoring_snapshots_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "proctoring_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "exam_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
