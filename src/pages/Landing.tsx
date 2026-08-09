import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckIcon, QuoteIcon, ShieldCheckIcon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ThemeToggle } from '../components/common/ThemeToggle';
import {
  capabilities,
  cycle,
  ecosystems,
  proofPoints,
  testimonial } from
'../data/landing';
import { images } from '../data/images';
import { card, hairline, mono, textPrimary, textSecondary } from '../utils/ui';

export function Landing() {
  return (
    <div className="min-h-screen w-full bg-background text-text-primary">
      <header
        className={`sticky top-0 z-30 border-b bg-background/90 backdrop-blur ${hairline}`}>
        
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo variant="full" size={24} wordmark="YAMI" title="YAMI" />
          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            {[
            { href: '#how', label: 'How it works' },
            { href: '#who', label: 'Who it is for' },
            { href: '#capabilities', label: 'Capabilities' }].
            map((item) =>
            <a
              key={item.href}
              href={item.href}
              className={`text-xs font-medium ${textSecondary} hover:text-text-primary`}>
              
                {item.label}
              </a>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />
            <Link to="/signin">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Corporate gradient + dot-grid backdrop */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)',
                backgroundSize: '26px 26px',
                maskImage: 'linear-gradient(to bottom, black, transparent 88%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 88%)'
              }} />

            <div
              className="absolute -top-36 left-1/2 h-[560px] w-[880px] -translate-x-1/2 rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, color-mix(in srgb, var(--accent) 24%, transparent), transparent 70%)'
              }} />

            <div
              className="absolute right-0 top-16 h-72 w-72 rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)'
              }} />

          </div>

          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center lg:py-24">
            <div>
              <Badge variant="info" dot>
                Trust infrastructure for informal credit
              </Badge>
              <h1
                className={`mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] ${textPrimary}`}>

                The credit you already give,{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, var(--accent), var(--accent-hover))'
                  }}>

                  finally written down.
                </span>
              </h1>
              <p
                className={`mt-4 max-w-lg text-sm leading-relaxed sm:text-base ${textSecondary}`}>

                Across Nigeria, goods and money move on trust and disappear from the
                record. YAMI documents the agreement, verifies both identities, tracks
                every repayment, and turns that behaviour into a reputation you can carry
                anywhere.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="[filter:drop-shadow(0_10px_20px_color-mix(in_srgb,var(--accent)_45%,transparent))]">

                  <Button size="lg" trailingIcon={<ArrowRightIcon className="h-4 w-4" />}>
                    Create a free account
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button size="lg" variant="secondary">
                    I already use YAMI
                  </Button>
                </Link>
              </div>
              <dl
                className={`mt-9 grid gap-4 rounded-xl border bg-surface/60 p-4 backdrop-blur-sm sm:grid-cols-3 ${hairline}`}>

                {proofPoints.map((point, i) =>
                <div
                  key={point.label}
                  className={
                  i > 0 ?
                  `border-t pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 ${hairline}` :
                  ''
                  }>

                    <dt className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
                      {point.label}
                    </dt>
                    <dd className={`mt-0.5 text-sm font-semibold ${textPrimary}`}>
                      {point.value}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="relative">
              <div
                className="absolute -inset-1 hidden rounded-2xl opacity-70 blur-lg sm:block"
                style={{
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--accent) 35%, transparent), transparent 60%)'
                }}
                aria-hidden="true" />

              <div
                className={`relative overflow-hidden rounded-2xl border shadow-lg ${hairline}`}>

                <img
                  src={images.shopkeeper}
                  alt="A shopkeeper in Lagos serving a customer while holding her phone"
                  className="h-72 w-full object-cover sm:h-96"
                  loading="eager" />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,10,11,0.78) 0%, rgba(10,10,11,0.15) 45%, transparent 70%)'
                  }}
                  aria-hidden="true" />

                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-medium text-white">
                    Live repayment tracking
                  </span>
                </div>
                <p className="absolute bottom-4 left-4 right-4 text-xs font-medium text-white/90 sm:left-64 sm:text-sm">
                  Every agreement, verified and on record.
                </p>
              </div>
              <div
                className={`absolute -bottom-6 left-4 hidden w-56 rounded-lg border bg-surface/90 p-3.5 shadow-xl backdrop-blur sm:block ${hairline}`}>

                <p className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
                  Owed to me
                </p>
                <p className={`${mono} text-xl font-semibold ${textPrimary}`}>₦482,000</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full w-2/3 rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, var(--accent), var(--accent-hover))'
                    }} />

                </div>
                <p className={`mt-1.5 text-[11px] ${textSecondary}`}>
                  Across 6 documented agreements
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who it is for */}
        <section
          id="who"
          className={`mt-8 border-y bg-surface py-12 sm:mt-0 sm:py-16 ${hairline}`}
          aria-labelledby="who-heading">
          
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="who-heading" className={`text-xl font-semibold ${textPrimary}`}>
              Three credit relationships, one record
            </h2>
            <p className={`mt-1.5 max-w-2xl text-sm ${textSecondary}`}>
              One account covers both sides. A retailer borrows from a wholesaler in the
              morning and extends credit to a customer in the afternoon.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {ecosystems.map((item) =>
              <article key={item.id} className={`${card} overflow-hidden`}>
                  <img
                  src={item.image}
                  alt={item.alt}
                  className="h-40 w-full object-cover"
                  loading="lazy" />
                
                  <div className={`border-t p-4 ${hairline}`}>
                    <h3 className={`text-sm font-semibold ${textPrimary}`}>
                      {item.title}
                    </h3>
                    <p className={`mt-1.5 text-xs leading-normal ${textSecondary}`}>
                      {item.description}
                    </p>
                  </div>
                </article>
              )}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how"
          className="mx-auto max-w-6xl px-4 py-12 sm:py-16"
          aria-labelledby="how-heading">
          
          <h2 id="how-heading" className={`text-xl font-semibold ${textPrimary}`}>
            The YAMI trust cycle
          </h2>
          <p className={`mt-1.5 max-w-2xl text-sm ${textSecondary}`}>
            Trust already exists. YAMI gives it structure — and a way back when repayment
            breaks down.
          </p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {cycle.map((item) =>
            <li key={item.step} className={`${card} p-4`}>
                <span className={`${mono} text-xs text-accent`}>{item.step}</span>
                <h3 className={`mt-1.5 text-sm font-semibold ${textPrimary}`}>
                  {item.title}
                </h3>
                <p className={`mt-1 text-xs leading-normal ${textSecondary}`}>
                  {item.description}
                </p>
              </li>
            )}
          </ol>

          <div className={`mt-6 overflow-hidden rounded-xl border ${hairline}`}>
            <img
              src={images.buildingSupplier}
              alt="A building materials supplier with a clipboard beside stacked cement bags and roofing sheets"
              className="h-48 w-full object-cover sm:h-64"
              loading="lazy" />
            
          </div>
        </section>

        {/* Capabilities */}
        <section
          id="capabilities"
          className={`border-y bg-surface py-12 sm:py-16 ${hairline}`}
          aria-labelledby="capabilities-heading">
          
          <div className="mx-auto max-w-6xl px-4">
            <h2
              id="capabilities-heading"
              className={`text-xl font-semibold ${textPrimary}`}>
              
              What the platform does
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((item) =>
              <article key={item.title} className={`${card} p-4`}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-subtle text-accent-subtle-foreground">
                    <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <h3 className={`mt-2.5 text-sm font-semibold ${textPrimary}`}>
                    {item.title}
                  </h3>
                  <p className={`mt-1 text-xs leading-normal ${textSecondary}`}>
                    {item.description}
                  </p>
                </article>
              )}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section
          className="mx-auto max-w-4xl px-4 py-12 sm:py-16"
          aria-label="Customer story">
          
          <figure className={`${card} flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6`}>
            <img
              src={testimonial.image}
              alt={testimonial.alt}
              className={`h-24 w-24 shrink-0 rounded-lg border object-cover sm:h-32 sm:w-32 ${hairline}`}
              loading="lazy" />
            
            <div>
              <QuoteIcon
                className={`h-5 w-5 ${textSecondary}`}
                aria-hidden="true" />
              
              <blockquote className={`mt-2 text-sm leading-relaxed ${textPrimary}`}>
                {testimonial.quote}
              </blockquote>
              <figcaption className={`mt-3 text-xs ${textSecondary}`}>
                <span className={`font-semibold ${textPrimary}`}>{testimonial.name}</span>
                {' · '}
                {testimonial.role}
              </figcaption>
            </div>
          </figure>
        </section>

        {/* Debt acquisition */}
        <section
          className={`border-y bg-surface py-12 sm:py-16 ${hairline}`}
          aria-labelledby="acquisition-heading">
          
          <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2 lg:items-center">
            <div className={`overflow-hidden rounded-xl border ${hairline}`}>
              <img
                src={images.textileMarket}
                alt="A wholesale textile trader checking a ledger beside stacked bales of fabric"
                className="h-64 w-full object-cover sm:h-80"
                loading="lazy" />
              
            </div>
            <div>
              <Badge variant="neutral">When repayment stops</Badge>
              <h2
                id="acquisition-heading"
                className={`mt-3 text-xl font-semibold ${textPrimary}`}>
                
                A way out that keeps the relationship intact
              </h2>
              <p className={`mt-2 text-sm leading-relaxed ${textSecondary}`}>
                Reminders come first, then early intervention, restructuring and
                mediation. For eligible distressed debts, YAMI can purchase the
                outstanding obligation: the lender takes liquidity and exits recovery,
                and the borrower keeps one workable plan instead of repeated demands.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                'Eligibility is based on viability, risk, affordability and expected recovery',
                'Acceptance is never automatic — checks happen before funds are released',
                'The borrower deals with one counterparty on agreed terms'].
                map((point) =>
                <li key={point} className="flex items-start gap-2.5">
                    <ShieldCheckIcon
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${textSecondary}`}
                    aria-hidden="true" />
                  
                    <span className={`text-xs leading-normal ${textSecondary}`}>
                      {point}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className={`${card} grid gap-0 overflow-hidden lg:grid-cols-2`}>
            <img
              src={images.marketTrader}
              alt="A market trader checking her phone at her stall in the early morning"
              className="h-56 w-full object-cover lg:h-full"
              loading="lazy" />
            
            <div className="p-6 sm:p-8">
              <h2 className={`text-xl font-semibold ${textPrimary}`}>
                Start with one relationship you already trust
              </h2>
              <p className={`mt-2 max-w-md text-sm leading-relaxed ${textSecondary}`}>
                Document it in two minutes. Both sides see the same terms, and the
                repayment record starts building your reputation immediately.
              </p>
              <div className="mt-5">
                <Link to="/signup">
                  <Button size="lg" trailingIcon={<ArrowRightIcon className="h-4 w-4" />}>
                    Create a free account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={`border-t py-8 ${hairline}`}>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center">
          <Logo variant="mono" size={20} wordmark="YAMI" title="YAMI" />
          <p className={`text-[11px] leading-normal ${textSecondary}`}>
            YAMI is credit infrastructure, not a lender. Identity data is encrypted and
            never shared without consent.
          </p>
        </div>
      </footer>
    </div>);

}