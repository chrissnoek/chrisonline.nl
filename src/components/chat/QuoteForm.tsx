/**
 * Bevestigingskaart voor een offerte-aanvraag (gevolg van de submitQuoteRequest-tool).
 *
 * VEILIGHEID: dit is de enige plek waar daadwerkelijk wordt verstuurd, en ALLEEN
 * op een echte klik op "Verstuur" → POST naar /api/quote. Het AI-model kan dit
 * niet triggeren (de tool heeft geen execute; deze component zit in de UI-laag).
 * Velden zijn voorgevuld vanuit de tool-input maar door de bezoeker aanpasbaar;
 * de server her-valideert alles met hetzelfde zod-schema.
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

export default function QuoteForm({ initial }: { initial: QuoteFields }) {
  const [f, setF] = useState<QuoteFields>(initial ?? {});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const set = (k: keyof QuoteFields) => (e: { target: { value: string } }) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  async function submit() {
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

  return (
    <div className="cw-quote">
      <strong className="cw-quote-title">Klopt dit? Dan komt het direct bij me binnen.</strong>
      <div className="cw-quote-grid">
        <label>
          Naam
          <input value={f.naam ?? ''} onChange={set('naam')} placeholder="Je naam" />
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
          />
        </label>
        <label>
          Type
          <select value={f.projecttype ?? ''} onChange={set('projecttype')}>
            <option value="" disabled>
              Kies…
            </option>
            {PROJECTTYPES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Budget
          <select value={f.budget ?? ''} onChange={set('budget')}>
            <option value="" disabled>
              Kies…
            </option>
            {BUDGETS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tijdlijn
          <select value={f.timeline ?? ''} onChange={set('timeline')}>
            <option value="" disabled>
              Kies…
            </option>
            {TIMELINES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="cw-quote-full">
          Omschrijving
          <textarea
            rows={5}
            value={f.omschrijving ?? ''}
            onChange={set('omschrijving')}
            placeholder="Wat wil je laten maken? Bijv. aantal/soorten pagina's, functies (formulier, projectoverzicht, boekingsmodule…), maatwerk of thema, stijl & animatie, koppelingen."
          />
        </label>
      </div>
      {status === 'error' ? <p className="cw-quote-error">{errorMsg}</p> : null}
      <button className="cw-quote-send" onClick={submit} disabled={status === 'sending'}>
        {status === 'sending' ? 'Versturen…' : 'Verstuur'}
      </button>
    </div>
  );
}
