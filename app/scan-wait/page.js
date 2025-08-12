'use client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode.react';

export default function ScanWaitPage() {
  const [sessionId, setSessionId] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const id = uuidv4();
    setSessionId(id);

    const interval = setInterval(async () => {
      const res = await fetch(`/api/scan?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!sessionId) return <div>Generating...</div>;

  if (result) {
    return (
      <div>
        <h1>Analysis Results</h1>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div>
      <h1>Scan this QR code on mobile</h1>
      <QRCode value={`${window.location.origin}/scan?id=${sessionId}`} size={256} />
      <p>Waiting for scan results...</p>
    </div>
  );
}
