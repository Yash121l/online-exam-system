import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../../components/Layout';
import { monitoringClient, MonitoringTile } from '../../lib/monitoring';
import { getAuth } from '../../lib/api';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function InvigilationDashboard() {
  const [tiles, setTiles] = useState<Record<string, MonitoringTile>>({});
  const [flags, setFlags] = useState<Array<{ examSessionId: string; flags: string[]; at: number }>>([]);
  const [chatMessages, setChatMessages] = useState<
    Array<{ examSessionId: string; from: string; message: string; at: number }>
  >([]);
  const [message, setMessage] = useState('');
  const role = useMemo(() => getAuth()?.role ?? 'GUEST', []);

  useEffect(() => {
    monitoringClient.onTile((tile) => {
      setTiles((prev) => ({ ...prev, [tile.examSessionId]: tile }));
    });
    monitoringClient.onFlag((payload) => {
      setFlags((prev) => [payload, ...prev].slice(0, 20));
    });
    monitoringClient.onSummary((payload) => {
      setTiles((prev) => ({
        ...prev,
        [payload.examSessionId]: {
          ...(prev[payload.examSessionId] ?? {
            flags: [],
            framesProcessed: 0,
            lastFrameType: null,
            lastUpdate: Date.now(),
            examSessionId: payload.examSessionId
          }),
          summary: payload.summary
        }
      }));
    });
    monitoringClient.onChat((payload) => {
      setChatMessages((prev) => [...prev, payload].slice(-40));
    });
  }, []);

  const sortedTiles = Object.values(tiles).sort((a, b) => b.lastUpdate - a.lastUpdate);
  const selectedSession = sortedTiles[0]?.examSessionId ?? 'unknown-session';

  const sendChat = () => {
    if (!message.trim()) return;
    monitoringClient.sendChat({ examSessionId: selectedSession, from: role, message });
    setChatMessages((prev) => [...prev, { examSessionId: selectedSession, from: role, message, at: Date.now() }]);
    setMessage('');
  };

  return (
    <Layout title="Live Invigilation">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Live invigilation</p>
          <h1 className="text-3xl font-bold text-slate-900">Monitor candidates in real-time</h1>
          <p className="text-slate-600">Tile view of webcam/screen/audio streams with instant flagging.</p>
        </div>
        <Button variant="secondary" onClick={() => monitoringClient.connect()}>
          Connect monitor
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>Active sessions</CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {sortedTiles.map((tile) => (
                <div key={tile.examSessionId} className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{tile.examSessionId.slice(0, 8)}...</span>
                    <span className="rounded bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700">
                      {tile.lastFrameType ?? 'n/a'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Frames: {tile.framesProcessed}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tile.flags.length === 0 && <span className="text-xs text-slate-500">No flags</span>}
                    {tile.flags.map((flag) => (
                      <span key={flag} className="rounded-full bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {sortedTiles.length === 0 && <p className="text-sm text-slate-600">Waiting for telemetry...</p>}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>Live flags</CardHeader>
            <CardContent className="max-h-[240px] overflow-y-auto space-y-2">
              {flags.map((flag) => (
                <div key={`${flag.examSessionId}-${flag.at}`} className="rounded-md border border-red-100 bg-red-50 p-2 text-sm text-red-800">
                  <div className="flex justify-between">
                    <strong>Session {flag.examSessionId.slice(0, 8)}...</strong>
                    <span className="text-xs">{new Date(flag.at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs">{flag.flags.join(', ')}</p>
                </div>
              ))}
              {flags.length === 0 && <p className="text-sm text-slate-500">No alerts yet.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Chat</CardHeader>
            <CardContent>
              <div className="mb-3 max-h-[180px] overflow-y-auto space-y-2 rounded-md border border-slate-200 p-2 text-sm">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="flex flex-col rounded-md bg-slate-50 p-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{msg.from}</span>
                      <span>{new Date(msg.at).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-800">{msg.message}</p>
                  </div>
                ))}
                {chatMessages.length === 0 && <p className="text-slate-500">Start a chat with the candidate.</p>}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message as ${role}`}
                />
                <Button onClick={sendChat}>Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
