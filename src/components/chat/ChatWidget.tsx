/**
 * Het chat-eiland (React) — de nieuwe hero.
 *
 * - useChat (@ai-sdk/react) tegen /api/chat met streaming.
 * - Idle-staat: orb-halo + groet + prompt + capability-chips (sketch 001B).
 * - Actieve staat: berichten, met tool-resultaten inline gerenderd (generative UI).
 * - Reasoning-parts worden verborgen (server stuurt ze al niet, maar dubbel veilig).
 * - Client-tools (openContactForm, bookCall) worden direct opgelost; submitQuoteRequest
 *   rendert een bevestigingskaart (verstuurt pas op klik); showProjects komt van de server.
 */
import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import Orb from './Orb';
import ProjectGallery from './ProjectGallery';
import QuoteForm from './QuoteForm';

const CHIPS = [
  { label: '🛠️ Wat kun je voor mij bouwen?', text: 'Wat kun je allemaal voor mij bouwen?' },
  { label: '📄 Vraag een offerte aan', text: 'Ik wil graag een offerte aanvragen.' },
  { label: '💼 Bekijk mijn werk', text: 'Laat eens wat van Chris zijn werk zien.' },
];

const BOOKING_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.PUBLIC_BOOKING_URL) ||
  'https://cal.com/chrissnoek';

export default function ChatWidget() {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { messages, sendMessage, status, addToolOutput, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      // Pure UI-signaal-tools meteen oplossen (zonder await → geen deadlock).
      if (toolCall.toolName === 'openContactForm' || toolCall.toolName === 'bookCall') {
        addToolOutput({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: { shown: true } });
      }
      // showProjects: server-executed (geen actie nodig).
      // submitQuoteRequest: door de gebruiker bevestigd via de kaart (geen auto-output).
    },
  });

  const busy = status === 'submitted' || status === 'streaming';
  const started = messages.length > 0;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  function submit(e?: { preventDefault?: () => void }) {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput('');
  }
  function ask(text: string) {
    if (busy) return;
    sendMessage({ text });
  }

  return (
    <div className={`cw-root${started ? ' cw-root--active' : ''}`}>
      <Orb />

      {!started ? (
        <div className="cw-greet">
          <p className="cw-greet-sub">Hoi, ik ben Chris&apos;s AI</p>
          <h1 className="cw-greet-main">Waarmee kan ik je helpen?</h1>
        </div>
      ) : (
        <div className="cw-thread" ref={scrollRef} aria-live="polite">
          {messages.map((m) => (
            <Message key={m.id} message={m} bookingUrl={BOOKING_URL} />
          ))}
          {status === 'submitted' ? <Skeleton /> : null}
        </div>
      )}

      <form className="cw-prompt-wrap" onSubmit={submit}>
        <label className="cw-prompt">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Vraag me iets…"
            aria-label="Stel een vraag"
            disabled={false}
          />
          {busy ? (
            <button type="button" className="cw-send cw-send--stop" onClick={() => stop()} aria-label="Stop">
              ◼
            </button>
          ) : (
            <button type="submit" className="cw-send" aria-label="Verstuur" disabled={!input.trim()}>
              ↑
            </button>
          )}
        </label>
      </form>

      {!started ? (
        <div className="cw-chips">
          {CHIPS.map((c) => (
            <button key={c.label} className="cw-chip" onClick={() => ask(c.text)}>
              {c.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="cw-msg cw-msg--assistant">
      <div className="cw-skeleton" />
      <div className="cw-skeleton" style={{ width: '70%' }} />
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function Message({ message, bookingUrl }: { message: any; bookingUrl: string }) {
  const isUser = message.role === 'user';
  return (
    <div className={`cw-msg ${isUser ? 'cw-msg--user' : 'cw-msg--assistant'}`}>
      {message.parts.map((part: any, i: number) => {
        // Tekst — token-fade via CSS-class.
        if (part.type === 'text') {
          return (
            <p key={i} className="cw-text">
              {part.text}
            </p>
          );
        }
        // Reasoning nooit tonen.
        if (part.type === 'reasoning') return null;

        // showProjects → kaarten.
        if (part.type === 'tool-showProjects') {
          if (part.state === 'output-available') {
            return <ProjectGallery key={i} projects={part.output?.projects ?? []} />;
          }
          return <Skeleton key={i} />;
        }
        // submitQuoteRequest → bevestigingskaart (verstuurt pas op klik).
        if (part.type === 'tool-submitQuoteRequest') {
          if (part.state === 'input-available' || part.state === 'output-available') {
            return <QuoteForm key={i} initial={part.input ?? {}} />;
          }
          return null;
        }
        // openContactForm → eenvoudige inline-vorm-CTA (hergebruikt /contact voor nu).
        if (part.type === 'tool-openContactForm') {
          return (
            <a key={i} className="cw-inline-cta" href="/contact">
              ✉️ Open het contactformulier
            </a>
          );
        }
        // bookCall → boekingslink.
        if (part.type === 'tool-bookCall') {
          return (
            <a key={i} className="cw-inline-cta" href={bookingUrl} target="_blank" rel="noopener noreferrer">
              📅 Plan een gesprek
            </a>
          );
        }
        return null;
      })}
    </div>
  );
}
