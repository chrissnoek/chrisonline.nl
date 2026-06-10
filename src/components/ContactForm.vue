<script setup lang="ts">
import { ref, computed } from 'vue';

/**
 * Toegankelijk contactformulier met live validatie en AJAX-submit naar
 * Netlify Forms. De form-markup wordt door Astro op de server gerenderd,
 * zodat Netlify het formulier bij de build detecteert.
 */

const FORM_NAME = 'contact';

const name = ref('');
const email = ref('');
const message = ref('');
const botField = ref(''); // honeypot
const touched = ref<Record<string, boolean>>({});
const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));

const errors = computed(() => ({
  name: name.value.trim().length < 2 ? 'Vul je naam in.' : '',
  email: !email.value
    ? 'Vul je e-mailadres in.'
    : !emailValid.value
      ? 'Vul een geldig e-mailadres in.'
      : '',
  message: message.value.trim().length < 10 ? 'Schrijf een bericht van minimaal 10 tekens.' : '',
}));

const isValid = computed(() => !errors.value.name && !errors.value.email && !errors.value.message);

function markTouched(field: string) {
  touched.value[field] = true;
}

function showError(field: 'name' | 'email' | 'message') {
  return touched.value[field] && errors.value[field];
}

async function onSubmit() {
  touched.value = { name: true, email: true, message: true };
  if (!isValid.value || botField.value) return;

  status.value = 'submitting';
  const data = new URLSearchParams();
  data.append('form-name', FORM_NAME);
  data.append('name', name.value);
  data.append('email', email.value);
  data.append('message', message.value);

  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data.toString(),
    });
    if (!res.ok) throw new Error(String(res.status));
    status.value = 'success';
    name.value = email.value = message.value = '';
    touched.value = {};
  } catch {
    status.value = 'error';
  }
}
</script>

<template>
  <!-- Succes-status -->
  <div
    v-if="status === 'success'"
    class="rounded-card border-accent-500/40 bg-accent-500/10 border p-8 text-center"
    role="status"
    aria-live="polite"
  >
    <p class="text-lg font-semibold text-[var(--fg)]">Bedankt voor je bericht!</p>
    <p class="mt-2 text-[var(--fg-muted)]">
      Ik neem zo snel mogelijk contact met je op, meestal binnen één werkdag.
    </p>
    <button
      type="button"
      class="rounded-pill mt-5 border border-[var(--border)] px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--bg-alt)]"
      @click="status = 'idle'"
    >
      Nog een bericht sturen
    </button>
  </div>

  <form
    v-else
    name="contact"
    method="POST"
    data-netlify="true"
    netlify-honeypot="bot-field"
    class="grid gap-5"
    novalidate
    @submit.prevent="onSubmit"
  >
    <input type="hidden" name="form-name" value="contact" />

    <!-- Honeypot: verborgen voor mensen -->
    <p class="hidden" aria-hidden="true">
      <label>Niet invullen: <input v-model="botField" name="bot-field" tabindex="-1" /></label>
    </p>

    <div>
      <label for="cf-name" class="mb-1.5 block text-sm font-medium text-[var(--fg)]"> Naam </label>
      <input
        id="cf-name"
        v-model="name"
        name="name"
        type="text"
        autocomplete="name"
        required
        :aria-invalid="!!showError('name')"
        :aria-describedby="showError('name') ? 'cf-name-error' : undefined"
        class="focus:border-accent-500 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[var(--fg)] transition-colors placeholder:text-[var(--fg-muted)]"
        placeholder="Je naam"
        @blur="markTouched('name')"
      />
      <p
        v-if="showError('name')"
        id="cf-name-error"
        class="mt-1.5 text-sm text-red-600 dark:text-red-400"
      >
        {{ errors.name }}
      </p>
    </div>

    <div>
      <label for="cf-email" class="mb-1.5 block text-sm font-medium text-[var(--fg)]">
        E-mailadres
      </label>
      <input
        id="cf-email"
        v-model="email"
        name="email"
        type="email"
        autocomplete="email"
        required
        :aria-invalid="!!showError('email')"
        :aria-describedby="showError('email') ? 'cf-email-error' : undefined"
        class="focus:border-accent-500 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[var(--fg)] transition-colors placeholder:text-[var(--fg-muted)]"
        placeholder="naam@voorbeeld.nl"
        @blur="markTouched('email')"
      />
      <p
        v-if="showError('email')"
        id="cf-email-error"
        class="mt-1.5 text-sm text-red-600 dark:text-red-400"
      >
        {{ errors.email }}
      </p>
    </div>

    <div>
      <label for="cf-message" class="mb-1.5 block text-sm font-medium text-[var(--fg)]">
        Bericht
      </label>
      <textarea
        id="cf-message"
        v-model="message"
        name="message"
        rows="5"
        required
        :aria-invalid="!!showError('message')"
        :aria-describedby="showError('message') ? 'cf-message-error' : undefined"
        class="focus:border-accent-500 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[var(--fg)] transition-colors placeholder:text-[var(--fg-muted)]"
        placeholder="Vertel kort over je project of vraag…"
        @blur="markTouched('message')"
      />
      <p
        v-if="showError('message')"
        id="cf-message-error"
        class="mt-1.5 text-sm text-red-600 dark:text-red-400"
      >
        {{ errors.message }}
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button
        type="submit"
        :disabled="status === 'submitting'"
        class="rounded-pill bg-accent-500 hover:bg-accent-600 inline-flex items-center justify-center px-7 py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ status === 'submitting' ? 'Versturen…' : 'Verstuur bericht' }}
      </button>
      <p v-if="status === 'error'" class="text-sm text-red-600 dark:text-red-400" role="alert">
        Er ging iets mis. Probeer het later opnieuw of mail direct.
      </p>
    </div>
  </form>
</template>
