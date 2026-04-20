import { forwardRef, useRef, useState, type FormEvent, type ReactNode } from 'react';

const WEBHOOK_URL = '/api/lead';

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
] as const;

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [time, setTime] = useState('');
  const [timezone, setTimezone] = useState<string>('America/Denver');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg('');

    if (!file) {
      setStatus('error');
      setErrorMsg('Please attach a CSV file.');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setStatus('error');
      setErrorMsg('File must be a .csv');
      return;
    }

    if (!time) {
      setStatus('error');
      setErrorMsg('Please choose a send deadline time.');
      return;
    }

    const formData = new FormData();
    formData.append('attach', file, file.name);
    formData.append('When do you need these sent by?', time);
    formData.append('timezone', timezone);

    setStatus('loading');

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Webhook responded ${res.status}`);
      }

      setStatus('success');
      setFile(null);
      setTime('');
      setTimezone('America/Denver');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error ? err.message : 'Submission failed. Try again.',
      );
    }
  }

  return (
    <>
      <div className="synthwave-bg" aria-hidden="true">
        <div className="synthwave-haze" />
        <div className="synthwave-sun" />
        <div className="synthwave-grid" />
      </div>

      <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            <span className="h-px w-8 bg-[color:var(--magenta)]/60" />
            <span className="text-glow-cyan">SYS // 1984</span>
            <span className="h-px w-8 bg-[color:var(--cyan)]/60" />
          </div>

          <section
            className="border-glow rounded-xl bg-card/70 p-8 backdrop-blur-xl sm:p-10"
            style={{ borderColor: 'transparent' }}
          >
            <header className="mb-8 text-center">
              <h1 className="font-display text-3xl font-bold uppercase text-foreground text-glow-magenta sm:text-4xl">
                Lead Send Scheduler
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Upload a CSV, choose the local send deadline, and submit.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <Field label="attach" htmlFor="attach">
                <FileInput
                  ref={fileInputRef}
                  id="attach"
                  file={file}
                  onChange={setFile}
                />
              </Field>

              <Field label="When do you need these sent by?" htmlFor="deadline-time">
                <input
                  id="deadline-time"
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-md border border-border bg-input/60 px-4 py-3 font-mono text-base text-foreground outline-none transition focus:border-[color:var(--cyan)] focus:[box-shadow:0_0_0_1px_oklch(0.82_0.18_200/0.7),0_0_16px_oklch(0.82_0.18_200/0.35)]"
                />
              </Field>

              <Field label="timezone" htmlFor="timezone">
                <div className="relative">
                  <select
                    id="timezone"
                    required
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full appearance-none rounded-md border border-border bg-input/60 px-4 py-3 pr-10 text-base text-foreground outline-none transition focus:border-[color:var(--cyan)] focus:[box-shadow:0_0_0_1px_oklch(0.82_0.18_200/0.7),0_0_16px_oklch(0.82_0.18_200/0.35)]"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz} className="bg-popover">
                        {tz}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--cyan)]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </Field>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="group relative w-full overflow-hidden rounded-md px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  background:
                    'linear-gradient(90deg, oklch(0.72 0.28 330) 0%, oklch(0.62 0.25 300) 50%, oklch(0.78 0.18 200) 100%)',
                  boxShadow:
                    '0 0 0 1px oklch(0.72 0.28 330 / 0.5), 0 8px 32px oklch(0.55 0.25 320 / 0.4), 0 0 60px oklch(0.55 0.25 320 / 0.25)',
                }}
              >
                <span className="relative z-10">
                  {status === 'loading' ? 'Scheduling…' : 'Schedule Sends'}
                </span>
              </button>

              {status === 'success' && (
                <div
                  role="status"
                  className="rounded-md border border-[color:var(--cyan)]/40 bg-[color:var(--cyan)]/5 px-4 py-3 text-sm text-[color:var(--cyan)] text-glow-cyan"
                >
                  ✓ Transmission received. Sends are scheduled.
                </div>
              )}

              {status === 'error' && errorMsg && (
                <div
                  role="alert"
                  className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground"
                >
                  ✕ {errorMsg}
                </div>
              )}
            </form>
          </section>

          <p className="mt-6 text-center text-[10px] uppercase tracking-[0.35em] text-muted-foreground/70">
            ◢ secure pipeline · n8n webhook ◣
          </p>
        </div>
      </main>
    </>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-display text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--magenta)] text-glow-magenta"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

type FileInputProps = {
  id: string;
  file: File | null;
  onChange: (file: File | null) => void;
};

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { id, file, onChange },
  ref,
) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-border bg-input/40 px-4 py-3 text-sm text-muted-foreground transition hover:border-[color:var(--magenta)]/70 hover:bg-input/60 hover:text-foreground"
    >
      <span className="flex items-center gap-3 truncate">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[color:var(--cyan)]/50 text-[color:var(--cyan)]"
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7l-4-4H4zm6 1.5L14.5 9H11a1 1 0 01-1-1V4.5z" />
          </svg>
        </span>
        <span className="truncate">{file ? file.name : 'Choose a .csv file…'}</span>
      </span>
      <span className="shrink-0 rounded border border-[color:var(--magenta)]/50 px-2 py-0.5 font-display text-[10px] uppercase tracking-widest text-[color:var(--magenta)]">
        Browse
      </span>
      <input
        ref={ref}
        id={id}
        type="file"
        accept=".csv,text/csv"
        required
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
});
