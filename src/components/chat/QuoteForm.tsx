/**
 * Bevestigingskaart voor een offerte-aanvraag (gevolg van de submitQuoteRequest-tool).
 *
 * VEILIGHEID: dit is de enige plek waar daadwerkelijk wordt verstuurd, en ALLEEN
 * op een echte klik op "Verstuur" → POST naar /api/quote. Het AI-model kan dit
 * niet triggeren (de tool heeft geen execute; deze component zit in de UI-laag).
 * Velden zijn voorgevuld vanuit de tool-input maar door de bezoeker aanpasbaar;
 * de server her-valideert alles met hetzelfde zod-schema.
 *
 * Na een geslaagde verzending meldt `onSubmitted` dit aan het chat-eiland, dat de
 * tool-call afrondt zodat het model de ontvangst kan bevestigen. `sent` herstelt
 * de kaart in verzonden staat (bv. na sessie-restore).
 */
import { useState } from 'react';

type QuoteFields = {
  naam?: string;
  bedrijf?: string;
  email?: string;
  projecttype?: string;
  budget?: string;
  timeline?: string;
  omschrijving?: string;
};

const PROJECTTYPES = ['website', 'webshop', 'advertising', 'onderhoud', 'anders'];
const BUDGETS = ['<2k', '2k-5k', '5k-10k', '10k+', 'onbekend'];
const TIMELINES = ['asap', '1-3-maanden', '3-6-maanden', 'flexibel'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side spiegel van het zod-schema; de server blijft de echte guard. */
function validate(f: QuoteFields): Partial<Record<keyof QuoteFields, string>> {
  const errors: Partial<Record<keyof QuoteFields, string>> = {};
  if (!f.naam || f.naam.trim().length < 2) errors.naam = 'Vul je naam in.';
  if (!f.email || !EMAIL_RE.test(f.email)) errors.email = 'Vul een geldig e-mailadres in.';
  if (!f.projecttype) errors.projecttype = 'Maak een keuze.';
  if (!f.budget) errors.budget = 'Maak een keuze.';
  if (!f.timeline) errors.timeline = 'Maak een keuze.';
  if (!f.omschrijving || f.omschrijving.trim().length < 10)
    errors.omschrijving = 'Beschrijf je project in minimaal 10 tekens.';
  return errors;
}

export default function QuoteForm({
  initial,
  sent = false,
  onSubmitted,
}: {
  initial: QuoteFields;
  sent?: boolean;
  onSubmitted?: () => void;
}) {
  const [f, setF] = useState<QuoteFields>(initial ?? {});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    sent ? 'sent' : 'idle',
  );
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof QuoteFields, string>>>({});

  const set = (k: keyof QuoteFields) => (e: { target: { value: string } }) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }));
    // Veldfout meteen opruimen zodra er getypt/gekozen wordt.
    setFieldErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  async function submit() {
    const errors = validate(f);
    if (Object.values(errors).some(Boolean)) {
      setFieldErrors(errors);
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(f),
      });
      if (res.ok) {
        setStatus('sent');
        onSubmitted?.();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setErrorMsg(
        data?.message ??
          (res.status === 422
            ? 'Controleer de velden, er klopt iets niet.'
            : 'Versturen lukte niet.'),
      );
      setStatus('error');
    } catch {
      setErrorMsg('Geen verbinding. Probeer het zo nog eens.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="cw-quote cw-quote--sent" role="status">
        <strong>✓ Verstuurd!</strong>
        <p>
          Bedankt {f.naam?.split(' ')[0] || ''}, je aanvraag staat bij me. Je hoort snel van me.
        </p>
      </div>
    );
  }

  const err = (k: keyof QuoteFields) =>
    fieldErrors[k] ? <span className="cw-quote-field-error">{fieldErrors[k]}</span> : null;

  return (
    <div className="cw-quote">
      <strong className="cw-quote-title">Klopt dit? Dan komt het direct bij me binnen.</strong>
      <div className="cw-quote-grid">
        <label>
          Naam
          <input
            value={f.naam ?? ''}
            onChange={set('naam')}
            placeholder="Je naam"
            required
            aria-invalid={!!fieldErrors.naam}
          />
          {err('naam')}
        </label>
        <label>
          Bedrijf <span className="cw-opt">(optioneel)</span>
          <input value={f.bedrijf ?? ''} onChange={set('bedrijf')} placeholder="Bedrijfsnaam" />
        </label>
        <label>
          E-mail
          <input
            type="email"
            value={f.email ?? ''}
            onChange={set('email')}
            placeholder="jij@bedrijf.nl"
            required
            aria-invalid={!!fieldErrors.email}
          />
          {err('email')}
        </label>
        <label>
          Type
          <select
            value={f.projecttype ?? ''}
            onChange={set('projecttype')}
            required
            aria-invalid={!!fieldErrors.projecttype}
          >
            <option value="" disabled>
              Kies…
            </option>
            {PROJECTTYPES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          {err('projecttype')}
        </label>
        <label>
          Budget
          <select
            value={f.budget ?? ''}
            onChange={set('budget')}
            required
            aria-invalid={!!fieldErrors.budget}
          >
            <option value="" disabled>
              Kies…
            </option>
            {BUDGETS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          {err('budget')}
        </label>
        <label>
          Tijdlijn
          <select
            value={f.timeline ?? ''}
            onChange={set('timeline')}
            required
            aria-invalid={!!fieldErrors.timeline}
          >
            <option value="" disabled>
              Kies…
            </option>
            {TIMELINES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          {err('timeline')}
        </label>
        <label className="cw-quote-full">
          Omschrijving
          <textarea
            rows={5}
            value={f.omschrijving ?? ''}
            onChange={set('omschrijving')}
            placeholder="Wat wil je laten maken? Bijv. aantal/soorten pagina's, functies (formulier, projectoverzicht, boekingsmodule…), maatwerk of thema, stijl & animatie, koppelingen."
            required
            aria-invalid={!!fieldErrors.omschrijving}
          />
          {err('omschrijving')}
        </label>
      </div>
      {status === 'error' ? <p className="cw-quote-error">{errorMsg}</p> : null}
      <button className="cw-quote-send" onClick={submit} disabled={status === 'sending'}>
        {status === 'sending' ? 'Versturen…' : 'Verstuur'}
      </button>
    </div>
  );
}
