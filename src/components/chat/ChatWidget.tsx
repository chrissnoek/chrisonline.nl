/**
 * Het chat-eiland (React) — de nieuwe hero.
 *
 * - useChat (@ai-sdk/react) tegen /api/chat met streaming.
 * - Idle-staat: orb-halo + groet + prompt + capability-chips (sketch 001B).
 * - Actieve staat: berichten, met tool-resultaten inline gerenderd (generative UI).
 * - Reasoning-parts worden verborgen (server stuurt ze al niet, maar dubbel veilig).
 * - Client-tools (openContactForm, bookCall) worden direct opgelost; submitQuoteRequest
 *   rendert een bevestigingskaart (verstuurt pas op klik); showProjects komt van de server.
 * - Fouten (rate limit / capaciteit / netwerk) krijgen een nette bubbel met retry en
 *   een uitweg naar /contact of de boekingslink — nooit stilte.
 * - Het gesprek overleeft navigatie binnen de sessie (sessionStorage), zodat een
 *   klik naar een projectpagina de context niet weggooit.
 */
import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import Orb from './Orb';
import ProjectGallery from './ProjectGallery';
import QuoteForm from './QuoteForm';

const CHIPS = [
  {
    label: '👀 Laat relevante ervaring zien',
    text: 'Laat werk zien dat relevant is voor een complexe, merkgedreven Shopify-webshop.',
  },
  {
    label: '💶 Wat kost een Shopify-webshop?',
    text: 'Ik plan een nieuwe Shopify-webshop. Kun je me helpen de scope en investering te bepalen?',
  },
  {
    label: '📅 Bespreek mijn webshop',
    text: 'Ik wil mijn Shopify-webshop even bespreken. Kunnen we een kort gesprek inplannen?',
  },
  {
    label: '↗️ Kan ik migreren naar Shopify?',
    text: 'Ik overweeg een migratie naar Shopify. Welke informatie heb je nodig om de aanpak te bepalen?',
  },
];

const BOOKING_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta as { env?: Record<string, string> }).env?.PUBLIC_BOOKING_URL) ||
  'https://cal.eu/chrissnoek/30min';

/** Wisselende voorbeeldprompts in de placeholder (alleen idle, respecteert reduced-motion). */
const PLACEHOLDERS = [
  "Bijv. 'ik wil een Shopify-webshop op maat'…",
  "Bijv. 'wat kost een Shopify-redesign?'…",
  "Bijv. 'kan ik migreren naar Shopify?'…",
  "Bijv. 'mijn huidige thema voelt te standaard'…",
  "Bijv. 'hoe verbeter ik mijn productpagina's?'…",
];

const STORAGE_KEY = 'cw-thread-v1';
const MAX_STORED_MESSAGES = 20;

/* eslint-disable @typescript-eslint/no-explicit-any */

function loadThread(): any[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/** Vertaal een transport-fout naar nette NL-copy (de server stuurt JSON-bodies). */
function errorInfo(err: Error) {
  let code = '';
  let serverMsg = '';
  try {
    const body = JSON.parse(err.message);
    code = body?.error ?? '';
    serverMsg = body?.message ?? '';
  } catch {
    /* geen JSON → netwerk/onbekend */
  }
  if (code === 'rate_limited') {
    return {
      title: 'Even te snel achter elkaar.',
      body: serverMsg || 'Wacht een paar tellen en probeer het dan opnieuw.',
      retry: true,
    };
  }
  if (code === 'capacity' || code === 'chat_unconfigured') {
    return {
      title: 'De chat is even niet beschikbaar.',
      body: serverMsg || 'Je bereikt me gelukkig ook zonder chat:',
      retry: false,
    };
  }
  return {
    title: 'Er ging iets mis met de verbinding.',
    body: 'Controleer je internetverbinding en probeer het opnieuw.',
    retry: true,
  };
}

export default function ChatWidget() {
  const [input, setInput] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Autoscroll alleen wanneer de bezoeker (vrijwel) onderaan zit; wie terugleest
  // wordt niet naar beneden getrokken door binnenstromende tokens.
  const stickToBottomRef = useRef(true);

  const {
    messages,
    sendMessage,
    status,
    error,
    regenerate,
    clearError,
    setMessages,
    addToolOutput,
    stop,
  } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    // Standaard doorsturen zodra alle tool-calls compleet zijn, met één
    // uitzondering: een quote-kaart die als 'niet verstuurd' is afgerond
    // (de bezoeker typte zelf verder) — dan stuurt de handmatige send al.
    sendAutomaticallyWhen: (opts) => {
      if (!lastAssistantMessageIsCompleteWithToolCalls(opts)) return false;
      const last = opts.messages.at(-1) as any;
      const declined = (last?.parts ?? []).some(
        (p: any) =>
          p.type === 'tool-submitQuoteRequest' &&
          p.state === 'output-available' &&
          p.output?.submitted === false,
      );
      return !declined;
    },
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      // Pure UI-signaal-tools meteen oplossen (zonder await → geen deadlock).
      if (toolCall.toolName === 'openContactForm' || toolCall.toolName === 'bookCall') {
        addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          output: { shown: true },
        });
      }
      // showProjects: server-executed (geen actie nodig).
      // submitQuoteRequest: door de gebruiker bevestigd via de kaart (geen auto-output).
    },
  });

  const busy = status === 'submitted' || status === 'streaming';
  const started = messages.length > 0;

  // Herstel het gesprek van deze sessie (ná mount: geen hydration-mismatch met
  // de server-gerenderde idle-staat).
  useEffect(() => {
    const saved = loadThread();
    if (saved) setMessages(saved as any);
  }, []);

  // Bewaar het gesprek zodat een klik naar een projectpagina niets weggooit.
  useEffect(() => {
    if (!messages.length) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
    } catch {
      /* storage vol of geblokkeerd: geen ramp */
    }
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottomRef.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Wisselende voorbeeldprompt in de idle-staat.
  useEffect(() => {
    if (started) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(
      () => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length),
      3500,
    );
    return () => window.clearInterval(id);
  }, [started]);

  // Screenreader-aankondiging: alleen het VOLTOOIDE antwoord, niet elke token.
  const prevStatusRef = useRef(status);
  useEffect(() => {
    if (prevStatusRef.current === 'streaming' && status === 'ready') {
      const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant') as any;
      const text = (lastAssistant?.parts ?? [])
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join(' ')
        .trim();
      if (text) setAnnouncement(text.slice(0, 300));
    }
    prevStatusRef.current = status;
  }, [status, messages]);

  function onThreadScroll() {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }

  function autosize() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }

  /** Openstaande quote-kaarten netjes afronden vóór een nieuw bericht: het
   *  model mag nooit een bengelende tool-call zonder output terugkrijgen. */
  function resolvePendingQuoteCards() {
    for (const m of messages as any[]) {
      for (const part of m.parts ?? []) {
        if (part.type === 'tool-submitQuoteRequest' && part.state === 'input-available') {
          addToolOutput({
            tool: 'submitQuoteRequest',
            toolCallId: part.toolCallId,
            output: {
              submitted: false,
              note: 'De bezoeker heeft de bevestigingskaart (nog) niet verstuurd en typte verder.',
            },
          });
        }
      }
    }
  }

  function submit(e?: { preventDefault?: () => void }) {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || busy) return;
    stickToBottomRef.current = true;
    resolvePendingQuoteCards();
    sendMessage({ text });
    setInput('');
    const ta = textareaRef.current;
    if (ta) ta.style.height = 'auto';
  }

  function ask(text: string) {
    if (busy) return;
    stickToBottomRef.current = true;
    resolvePendingQuoteCards();
    sendMessage({ text });
  }

  function onQuoteSubmitted(toolCallId: string) {
    // Bevestig de tool-call richting het model → auto-send laat het model
    // de ontvangst kort bevestigen. De note is expliciet, anders leest het
    // model `submitted: true` als "kaart staat klaar" en vraagt het de
    // bezoeker nogmaals op Verstuur te klikken.
    addToolOutput({
      tool: 'submitQuoteRequest',
      toolCallId,
      output: {
        submitted: true,
        note: 'De bezoeker heeft de bevestigingskaart zojuist verstuurd en de aanvraag is binnen. Bedank kort en rond af; vraag NIET om (nogmaals) te versturen.',
      },
    });
  }

  function resetThread() {
    stop();
    clearError();
    setMessages([]);
    setInput('');
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* prima */
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className={`cw-root ${started ? 'cw-root--active' : ''}`}>
      <Orb busy={busy} />

      {!started ? (
        <div className="cw-greet">
          {/* Eén h1 met naam + rol (SEO/a11y) én de hook; visueel twee regels. */}
          <h1 className="cw-greet-main">
            <span className="cw-greet-sub">
              Hoi, ik ben Chris Snoek, Shopify-designer &amp; frontenddeveloper
            </span>
            Waar moet je webshop naartoe?
          </h1>
          <p className="cw-greet-subline">
            Stel je vraag over Shopify, een redesign, migratie of doorontwikkeling. Ik denk direct
            met je mee. Geen contactformulier, gewoon typen.
          </p>
        </div>
      ) : (
        <div
          className="cw-thread"
          ref={scrollRef}
          role="log"
          aria-live="off"
          onScroll={onThreadScroll}
        >
          {messages.map((m) => (
            <Message
              key={m.id}
              message={m}
              bookingUrl={BOOKING_URL}
              onQuoteSubmitted={onQuoteSubmitted}
            />
          ))}
          {status === 'submitted' ? <TypingBubble /> : null}
          {status === 'error' && error ? (
            <ErrorBubble error={error} bookingUrl={BOOKING_URL} onRetry={() => regenerate()} />
          ) : null}
        </div>
      )}

      {/* Voltooide antwoorden voor screenreaders (de thread zelf streamt te druk). */}
      <div className="cw-sr" role="status" aria-live="polite">
        {announcement}
      </div>

      <form className="cw-prompt-wrap" onSubmit={submit}>
        <label className="cw-prompt">
          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              autosize();
            }}
            onKeyDown={onKeyDown}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            aria-label="Stel een vraag"
          />
          {busy ? (
            <button
              type="button"
              className="cw-send cw-send--stop"
              onClick={() => stop()}
              aria-label="Stop"
            >
              ◼
            </button>
          ) : (
            <button
              type="submit"
              className="cw-send"
              aria-label="Verstuur"
              disabled={!input.trim()}
            >
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
      ) : (
        <button type="button" className="cw-reset" onClick={resetThread}>
          ↺ Opnieuw beginnen
        </button>
      )}
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

/* Typing-indicator: assistant-bubbel met label + drie stuiterende dots.
   Toont tijdens 'submitted' (na versturen, vóór de eerste tokens). De orb
   gloeit en versnelt ondertussen via de `busy`-prop. */
function TypingBubble() {
  return (
    <div className="cw-msg cw-msg--assistant cw-typing" aria-label="Chris denkt na">
      <span className="cw-typing-label">Chris denkt na</span>
      <span className="cw-typing-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}

/* Foutbubbel: nooit stilte. Nette uitleg per geval, retry waar zinvol, en
   altijd een uitweg naar contact of een gesprek. */
function ErrorBubble({
  error,
  bookingUrl,
  onRetry,
}: {
  error: Error;
  bookingUrl: string;
  onRetry: () => void;
}) {
  const info = errorInfo(error);
  return (
    <div className="cw-msg cw-msg--assistant cw-error" role="alert">
      <strong>{info.title}</strong>
      <p className="cw-error-body">{info.body}</p>
      <div className="cw-error-actions">
        {info.retry ? (
          <button type="button" className="cw-inline-cta" onClick={onRetry}>
            ↻ Probeer opnieuw
          </button>
        ) : null}
        <a className="cw-inline-cta" href="/contact">
          ✉️ Contactformulier
        </a>
        <a className="cw-inline-cta" href={bookingUrl} target="_blank" rel="noopener noreferrer">
          📅 Bespreek je webshop
        </a>
      </div>
    </div>
  );
}

function Message({
  message,
  bookingUrl,
  onQuoteSubmitted,
}: {
  message: any;
  bookingUrl: string;
  onQuoteSubmitted: (toolCallId: string) => void;
}) {
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
            const sent = part.state === 'output-available' && part.output?.submitted === true;
            return (
              <QuoteForm
                key={i}
                initial={part.input ?? {}}
                sent={sent}
                onSubmitted={() => onQuoteSubmitted(part.toolCallId)}
              />
            );
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
            <a
              key={i}
              className="cw-inline-cta"
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              📅 Bespreek je webshop
            </a>
          );
        }
        return null;
      })}
    </div>
  );
}
