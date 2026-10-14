import posthog from 'posthog-js';

// PostHog product analytics.
//
// This portal is used by exam takers, so it is treated as sensitive:
// - replays mask every input and every text node, and never record <video>,
//   <canvas> or blob:/data: images (webcam feeds, screen previews);
// - autocapture does not collect element text or attributes;
// - users are identified by internal id and role only, never email or name;
// - inside the AegisExam secure client (Electron, which does its own camera
//   and screen proctoring) session replay is switched off entirely.
//
// The phc_ key is a public client key committed in .env.production, and events
// go through the /ingest rewrite in next.config.js.

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const APP = 'online-exam-system';

let enabled = false;

function isSecureClient() {
  return typeof window !== 'undefined' && typeof (window as any).aegisExam !== 'undefined';
}

export function initAnalytics() {
  if (enabled || typeof window === 'undefined' || !KEY) return;
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  if ((process.env.NODE_ENV !== 'production' || isLocal) && process.env.NEXT_PUBLIC_POSTHOG_DEV !== '1') return;

  const secureClient = isSecureClient();
  posthog.init(KEY, {
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-08-30',
    person_profiles: 'identified_only',
    capture_pageview: 'history_change',
    capture_pageleave: true,
    autocapture: true,
    mask_all_text: true,
    mask_all_element_attributes: true,
    enable_heatmaps: true,
    capture_dead_clicks: true,
    capture_exceptions: true,
    capture_performance: { web_vitals: true },
    disable_session_recording: secureClient,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '*',
      blockSelector: 'video, canvas, iframe, img[src^="blob:"], img[src^="data:"], .ph-no-capture'
    }
  });
  posthog.register({ app: APP, client: secureClient ? 'secure_client' : 'web' });
  enabled = true;
}

type Events = {
  user_signed_up: { role: string };
  user_logged_in: { role: string; remembered: boolean };
  exam_created: { exam_type: string; proctoring_level?: string; require_secure_client?: boolean; duration_minutes?: number };
  question_added: { source: 'exam' | 'question_bank'; type?: string };
  exam_scheduled: { navigation?: string; randomize_questions?: boolean; randomize_options?: boolean };
  exam_published: { published: boolean };
  exam_join_attempted: { success: boolean };
  secure_client_launched: Record<string, never>;
};

export function track<E extends keyof Events>(event: E, props: Events[E]) {
  if (enabled) posthog.capture(event, props);
}

// Internal id and role only; no email, name or phone as person properties.
export function identifyUser(user?: { id: string; role: string } | null) {
  if (!enabled || !user?.id) return;
  if (posthog.get_distinct_id() === user.id) return;
  posthog.identify(user.id, { role: user.role });
}

export function resetAnalytics() {
  if (enabled) posthog.reset();
}
