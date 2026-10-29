'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { CleanzoContent } from '@/lib/cleanzo-data'
import type { Media } from '@/payload-types'

const container = 'mx-auto w-full max-w-[1600px] px-6 lg:px-12'
const mintButton =
  'inline-flex items-center justify-center rounded-[15px] bg-mint px-6 py-3.5 text-[15px] font-semibold text-[#52745e] shadow-[0_6px_17px_#9ae7c533] transition hover:bg-[#82dcb5] focus-visible:outline-olive disabled:opacity-40'
const money = (value: number) => `₹${value.toLocaleString('en-IN')}`
const categories = [
  ['all', 'All Items'],
  ['daily', 'Daily Laundry (kg)'],
  ['men', 'Men’s Wear'],
  ['women', 'Women’s Wear'],
  ['linens', 'Curtains & Linens'],
  ['shoes', 'Shoe Spa'],
]
function uploaded(value: Media | string | null | undefined) {
  return value && typeof value === 'object' && value.url ? value : null
}

function SectionTitle({
  badge,
  title,
  description,
}: {
  badge: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto mb-14 max-w-[880px] text-center">
      <span className="inline-block rounded-full bg-[#e7decf] px-4 py-2 text-[12px] font-bold tracking-[.13em] text-olive">
        {badge}
      </span>
      <h2 className="mt-4 text-[30px] leading-[1.22] font-extrabold tracking-[-.035em] md:text-[40px]">
        {title}
      </h2>
      <p className="mt-4 text-[16px] leading-7 text-[#626b52] md:text-[17px]">{description}</p>
    </div>
  )
}

function LaunchBanner({ date }: { date?: string | null }) {
  const [remaining, setRemaining] = useState<number | null>(null)
  useEffect(() => {
    if (!date) return
    const update = () => setRemaining(Math.max(0, new Date(date).getTime() - Date.now()))
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [date])
  if (!date) return null
  const value = Math.floor((remaining ?? 0) / 1000)
  const parts = [
    Math.floor(value / 86400),
    Math.floor((value % 86400) / 3600),
    Math.floor((value % 3600) / 60),
    value % 60,
  ]
  return (
    <div className="flex min-h-[52px] items-center justify-center bg-ink px-4 py-2 text-center text-[12px] font-semibold text-white md:text-[14px]">
      <div className="rounded-full border border-[#737c5366] bg-[#49503466] px-5 py-2">
        <span className="mr-3 text-olive">•</span> 🚀{' '}
        {remaining === 0 ? 'Now Open' : 'Opening Soon'} · 31st Oct{' '}
        <span className="mx-3 text-[#9ca38c]">|</span>
        {remaining === null ? (
          <span>Fresh care is on its way</span>
        ) : remaining === 0 ? (
          <span>Your fresh start begins here</span>
        ) : (
          parts.map((part, index) => (
            <span key={index}>
              {index > 0 && <span className="px-1 text-olive">:</span>}
              <strong className="tracking-widest">{String(part).padStart(2, '0')}</strong>
              <small className="ml-0.5 text-olive">{['D', 'H', 'M', 'S'][index]}</small>
            </span>
          ))
        )}
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-10 w-10" aria-hidden="true">
      <path
        d="M27 15.5a11 11 0 0 1-16.3 9.7L4 27l1.8-6.5A11 11 0 1 1 27 15.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M11 9c-1 0-2 1.5-2 3 0 4 6 10 10 10 2 0 4-2 3-3l-3-2-2 1c-2-1-3-2-4-4l1-2-2-3h-1Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function CleanzoWebsite({ content }: { content: CleanzoContent }) {
  const { services, rates, team, faqs, brand } = content
  const logo = uploaded(brand.logo)
  const hero = uploaded(brand.hero)
  const phone = brand.phone || ''
  const whatsapp = (message: string) =>
    `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState('all')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [pincode, setPincode] = useState('')
  const [areaMessage, setAreaMessage] = useState('')
  const [booking, setBooking] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'saving' | 'success'>('idle')
  const [bookingError, setBookingError] = useState('')
  const [bookingReference, setBookingReference] = useState('')
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const selected = rates.filter((item) => (quantities[item.id] || 0) > 0)
  const subtotal = selected.reduce((sum, item) => sum + quantities[item.id] * item.price, 0)
  const count = selected.reduce((sum, item) => sum + quantities[item.id], 0)
  useEffect(() => {
    if (booking) {
      dialog.current?.showModal()
      document.body.style.overflow = 'hidden'
    } else {
      dialog.current?.close()
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [booking])
  function openBooking() {
    setBookingError('')
    setBookingStatus('idle')
    setBooking(true)
    setMenuOpen(false)
  }
  function add(id: string) {
    setQuantities((current) => ({ ...current, [id]: Math.min(99, (current[id] || 0) + 1) }))
  }
  function subtract(id: string) {
    setQuantities((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) - 1) }))
  }
  function addService(rateId: string) {
    if (!rates.some((rate) => rate.id === rateId)) return
    add(rateId)
    setCategory('all')
    document
      .getElementById('estimator')
      ?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      })
  }
  async function submitPickup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBookingStatus('saving')
    setBookingError('')
    const fields = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const response = await fetch('/api/pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          items: selected.map((item) => ({ rateItem: item.id, quantity: quantities[item.id] })),
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.success)
        throw new Error(result.error || 'Please try again or contact us on WhatsApp.')
      setBookingReference(String(result.reference))
      setBookingStatus('success')
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : 'Unable to save your request. Please try again.',
      )
      setBookingStatus('idle')
    }
  }
  const orderMessage = `Hello Mr. Cleanzo, I’d like to arrange a pickup.\n\n${selected.map((item) => `${item.name}: ${quantities[item.id]} ${item.unit} × ${money(item.price)} = ${money(quantities[item.id] * item.price)}`).join('\n')}\n\nEstimated cleaning subtotal: ${money(subtotal)}. Please confirm the pickup time, final weight and price, and any delivery charges.`
  const nav = [
    ['services', 'Services'],
    ['estimator', 'Rate Estimator'],
    ['how-it-works', 'How It Works'],
    ['leadership', 'Leadership'],
    ['faq', 'FAQ'],
  ]
  return (
    <>
      <LaunchBanner date={brand.openingDate} />
      <header className="sticky top-0 z-40 border-b border-line bg-[#f3efe6ed] backdrop-blur-xl">
        <div className={`${container} flex h-[88px] items-center justify-between gap-5`}>
          <a href="#" aria-label="Mr. Cleanzo home" className="shrink-0">
            {logo ? (
              <Image
                src={logo.url!}
                alt="Mr. Cleanzo by Sarvadaa"
                width={120}
                height={60}
                className="h-[60px] w-[120px] object-contain"
                priority
              />
            ) : (
              <span className="font-extrabold">Mr. Cleanzo</span>
            )}
          </a>
          <nav
            aria-label="Main navigation"
            className="mr-auto ml-[13.2vw] hidden items-center gap-8 text-[15px] font-semibold xl:flex"
          >
            {nav.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="transition hover:text-olive">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={openBooking} className={`${mintButton} hidden px-7 sm:inline-flex`}>
              Schedule Pickup
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg border border-line px-3 py-2 text-sm xl:hidden"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            className="border-t border-line bg-beige px-6 py-4 xl:hidden"
            aria-label="Mobile navigation"
          >
            {nav.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-semibold"
              >
                {label}
              </a>
            ))}
            <button onClick={openBooking} className={`${mintButton} mt-3 w-full`}>
              Schedule Pickup
            </button>
          </nav>
        )}
      </header>

      <main>
        <section className="hero-surface py-12 lg:py-[76px]">
          <div
            className={`${container} grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14`}
          >
            <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_15px_30px_#3b4c2420]">
              {hero ? (
                <Image
                  src={hero.url!}
                  alt="A freshly pressed white shirt and sage-green blazer on wooden hangers. Atelier care, 100% PERC-free."
                  width={1100}
                  height={585}
                  priority
                  className="aspect-[1.88/1] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[1.88/1] items-center justify-center bg-beige text-5xl">
                  👔
                </div>
              )}
              <div className="p-6 lg:p-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-[24px] leading-tight font-extrabold tracking-[-.035em]">
                    Bespoke Couture & Daily Care
                  </h2>
                  <span className="rounded-full bg-[#eef0e6] px-3 py-1 text-[13px] font-semibold text-[#75825f]">
                    🌟 4.9 Superb
                  </span>
                </div>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#626b52]">
                  Handcrafted ozone purification, zero harsh chemicals, and precision Italian steam
                  press delivered directly to your doorstep.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    ['🌿', '100% Eco-Pure', 'Zero toxic PERC'],
                    ['⚡️', '24h Express', 'Free return > ₹300'],
                  ].map(([emoji, title, text]) => (
                    <div
                      className="flex items-center gap-3 rounded-[14px] border border-line bg-beige px-4 py-3"
                      key={title}
                    >
                      <span className="text-[23px]">{emoji}</span>
                      <div>
                        <strong className="block text-[13px] leading-4">{title}</strong>
                        <span className="block text-[12px] leading-4 text-[#73755f]">{text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="#estimator" className={`${mintButton} mt-5 w-full py-3.5`}>
                  📊 Calculate Full Order Cost
                </a>
              </div>
            </div>
            <div>
              <div className="inline-flex rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-[#6d7d51] shadow-sm">
                🌿 Zero toxic PERC · Fabric-Safe Ozone Wash
              </div>
              <h1 className="mt-7 text-[38px] leading-[1.13] font-extrabold tracking-[-.045em] sm:text-[48px] lg:text-[clamp(48px,3.8vw,62px)]">
                Garment care & dry cleaning,{' '}
                <span className="text-[#758552]">perfected in 24 hours.</span>
              </h1>
              <p className="mt-6 max-w-[680px] text-[17px] leading-[1.65] text-[#62664e] lg:text-[20px]">
                Experience boutique garment care at your doorstep. We wash, fold, steam press, and
                dry clean with zero toxic solvents, authentic saree roll-pressing, and daily laundry
                at ₹89/kg.
              </p>
              <form
                className="mt-9 max-w-[565px] rounded-[22px] border border-line bg-white p-6 shadow-[0_10px_25px_#6c625908]"
                onSubmit={(event) => {
                  event.preventDefault()
                  setAreaMessage('Our valet team will confirm coverage for your pincode.')
                  openBooking()
                }}
              >
                <label htmlFor="area-pincode" className="mb-3 block text-[14px] font-semibold">
                  📍 Check Doorstep Valet in Your Area
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="area-pincode"
                    value={pincode}
                    onChange={(event) =>
                      setPincode(event.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    required
                    pattern="[1-9][0-9]{5}"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="Enter 6-digit Pincode (e.g. 275101)"
                    className="min-w-0 flex-1 rounded-[12px] border border-line px-4 py-4 font-mono text-[14px] placeholder:text-[#a1a19b]"
                  />
                  <button type="submit" className={`${mintButton} shrink-0`}>
                    Check Area
                  </button>
                </div>
              </form>
              <div className="mt-9 grid grid-cols-3 gap-3">
                {[
                  ['⭐', '4.9 / 5 Rating', '12,000+ happy patrons'],
                  ['🛡️', '₹50,000 Guarantee', 'Complete garment cover'],
                  ['⚡', '100% Electric Valet', 'Eco-friendly fleet'],
                ].map(([emoji, title, text]) => (
                  <div key={title} className="flex items-center gap-3">
                    <span className="rounded-[10px] bg-[#e8e0d1] p-2 text-[22px]">{emoji}</span>
                    <div>
                      <strong className="block text-[11px] leading-5 xl:text-[15px]">
                        {title}
                      </strong>
                      <small className="block text-[10px] text-[#77775f] xl:text-[12px]">
                        {text}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="overflow-hidden bg-ink py-5 text-white"
          aria-label="Garment-care benefits"
        >
          <div className="benefits-motion flex w-max">
            {[0, 1].map((copy) => (
              <div
                className="flex shrink-0 items-center"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {[
                  '⏱️ Express 24 to 48-hour turnaround',
                  '🛡️ ₹50,000 garment protection cover',
                  '⚡ 100% PERC-free eco solvents',
                  '🌿 Gentle fabric care & zero odor',
                  '🛵 Free electric valet on orders over ₹300',
                  '♨️ Precision steam finishing & crisp creases',
                  '🥻 Traditional Charak roll press for heritage silks',
                ].map((text) => (
                  <span
                    className="flex items-center gap-10 px-5 text-[13px] font-semibold tracking-[.09em] whitespace-nowrap uppercase"
                    key={text}
                  >
                    {text}
                    <span className="text-[#63704d]">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section id="services" className={`${container} py-20 lg:py-24`}>
          <SectionTitle
            badge="OUR SERVICES"
            title="Specialized Care for Every Fabric"
            description="From daily office formals to delicate bridal heirlooms and heavy home curtains, every garment is inspected, treated, and hand-finished with utmost care."
          />
          <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => {
              const rateId =
                typeof service.rateItem === 'string' ? service.rateItem : service.rateItem.id
              return (
                <article
                  key={service.id}
                  className={`relative flex flex-col rounded-[24px] border p-7 transition duration-200 hover:-translate-y-1 hover:border-olive hover:shadow-[0_16px_30px_#7b8e5b1c] ${service.badge ? 'border-[#a8ad91] bg-gradient-to-br from-beige to-white' : 'border-line bg-white'}`}
                >
                  {service.badge && (
                    <span className="absolute top-5 right-5 rounded bg-[#e7e3d7] px-2 py-1 text-[10px] font-bold tracking-wide text-[#7b845f]">
                      {service.badge}
                    </span>
                  )}
                  <span className="mt-4 mb-7 text-[38px]" aria-hidden="true">
                    {service.emoji}
                  </span>
                  <h3 className="text-[21px] leading-[1.3] font-bold tracking-[-.02em]">
                    {service.title}
                  </h3>
                  <p className="mt-3 mb-7 text-[14px] leading-[1.6] text-[#626b52]">
                    {service.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-line/60 pt-5">
                    <span className="text-[22px] font-extrabold tracking-[-.03em]">
                      {service.priceLabel}
                      <small className="ml-1 text-[12px] font-normal tracking-normal text-[#626b52]">
                        / {service.unitLabel}
                      </small>
                    </span>
                    <button
                      onClick={() => addService(rateId)}
                      disabled={!rates.some((rate) => rate.id === rateId)}
                      className={`${mintButton} rounded-xl px-4 py-2 text-[13px]`}
                      aria-label={`Add ${service.title} to estimate`}
                    >
                      + Add
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          {!services.length && (
            <p className="py-10 text-center text-[#626b52]">
              Our care services are being updated. Please contact our concierge for the latest
              options.
            </p>
          )}
        </section>

        <section id="estimator" className="border-y border-line bg-[#f7f8fa] py-20 lg:py-24">
          <div className={container}>
            <SectionTitle
              badge="INSTANT CALCULATOR"
              title="Transparent 2026 Rate Estimator"
              description="Select your garments below to get an instant cost estimate in ₹ INR before booking your pickup."
            />
            <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,3.2fr)_minmax(260px,.9fr)]">
              <div className="rounded-[28px] border border-line bg-white p-5 shadow-[0_12px_30px_#80745a06] md:p-9">
                <div
                  className="mb-8 flex flex-wrap gap-2"
                  role="group"
                  aria-label="Filter garments"
                >
                  {categories.map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setCategory(id)}
                      aria-pressed={category === id}
                      className={`rounded-[13px] border px-4 py-3 text-[13px] font-semibold transition ${category === id ? 'border-[#858b7e] bg-[#858b7e] text-white' : 'border-[#f0f0ec] bg-white text-[#8b8e86] hover:border-olive hover:text-ink'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="grid max-h-[600px] grid-cols-1 gap-[18px] overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
                  {rates
                    .filter((item) => category === 'all' || item.category === category)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex min-w-0 items-center gap-3 rounded-[18px] border border-line p-4"
                      >
                        <span className="shrink-0 text-[24px]" aria-hidden="true">
                          {item.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[14px] font-semibold" title={item.name}>
                            {item.name}
                          </h3>
                          <span className="mt-1 block text-[12px] text-[#7c8861]">
                            <strong>{money(item.price)}</strong>{' '}
                            <small className="text-[#666e5c]">
                              {item.unit === 'kg' ? '/ kg' : item.unit}
                            </small>
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <button
                            onClick={() => subtract(item.id)}
                            disabled={!quantities[item.id]}
                            aria-label={`Remove one ${item.name}`}
                            className="grid h-8 w-8 place-items-center rounded-[9px] border border-[#e7e8e3] bg-[#fafbfa] text-lg text-[#77836a] disabled:opacity-40"
                          >
                            −
                          </button>
                          <output
                            className="min-w-3 text-center text-[14px] font-semibold"
                            aria-label={`${item.name} quantity`}
                          >
                            {quantities[item.id] || 0}
                          </output>
                          <button
                            onClick={() => add(item.id)}
                            disabled={quantities[item.id] >= 99}
                            aria-label={`Add one ${item.name}`}
                            className="grid h-8 w-8 place-items-center rounded-[9px] border border-[#e7e8e3] bg-[#fafbfa] text-lg text-[#77836a] hover:border-olive disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  {!rates.length && (
                    <p className="col-span-full p-6 text-sm text-[#626b52]">
                      Rates are being updated. Contact our team for a personal estimate.
                    </p>
                  )}
                </div>
              </div>
              <aside className="rounded-[28px] border border-line bg-white p-8 shadow-[0_12px_30px_#80745a08]">
                <div className="flex items-center justify-between gap-5">
                  <h3 className="text-[21px] leading-8 font-extrabold tracking-tight">
                    Your Order
                    <br />
                    Estimate
                  </h3>
                  <span className="rounded-full bg-[#edfff5] px-3 py-2 text-[12px] font-semibold text-[#586d45]">
                    {count} items
                  </span>
                </div>
                <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#f1f4f8]">
                  <div
                    className="h-full rounded-full bg-mint transition-[width]"
                    style={{ width: `${Math.min(100, (subtotal / 300) * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-[12px] leading-5 text-[#626b52]" aria-live="polite">
                  {subtotal < 300
                    ? `Add ${money(300 - subtotal)} for free doorstep delivery`
                    : 'Free doorstep delivery unlocked!'}
                </p>
                <div className="my-6 max-h-[230px] min-h-[145px] overflow-y-auto">
                  {selected.length ? (
                    selected.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-3 border-b border-line/50 py-3 text-[12px]"
                      >
                        <span>
                          {item.emoji} {item.name}
                          <small className="mt-1 block text-[#7c8861]">
                            {quantities[item.id]} × {money(item.price)}
                          </small>
                        </span>
                        <strong className="shrink-0">
                          {money(item.price * quantities[item.id])}
                        </strong>
                      </div>
                    ))
                  ) : (
                    <p className="px-2 py-7 text-center text-[13px] leading-6 text-[#626b52]">
                      No items selected yet. Click + on any item above.
                    </p>
                  )}
                </div>
                <div className="space-y-3 border-t border-line pt-5 text-[13px] text-[#626b52]">
                  <div className="flex justify-between gap-5">
                    <span>Subtotal:</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span>
                      Doorstep
                      <br />
                      Delivery:
                    </span>
                    <strong>{subtotal >= 300 ? 'FREE' : 'FREE over ₹300'}</strong>
                  </div>
                </div>
                <div className="mt-4 flex justify-between gap-3 border-t-2 border-line pt-4 text-[23px] leading-9 font-extrabold">
                  <span>
                    Estimated
                    <br />
                    Total:
                  </span>
                  <span className="text-olive" aria-live="polite">
                    {money(subtotal)}
                  </span>
                </div>
                {selected.length ? (
                  <a
                    href={whatsapp(orderMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block rounded-[14px] bg-[#f3fff6] px-3 py-4 text-center text-[14px] font-semibold text-[#678662]"
                  >
                    💬 Confirm & Order on WhatsApp
                  </a>
                ) : (
                  <button
                    disabled
                    className="mt-6 w-full rounded-[14px] bg-[#f6fff8] px-3 py-4 text-center text-[14px] font-semibold text-[#a5aaa2]"
                  >
                    💬 Confirm & Order on WhatsApp
                  </button>
                )}
                <button
                  onClick={openBooking}
                  className={`${mintButton} mt-3 w-full px-3 text-center leading-6`}
                >
                  ⚡ Schedule Valet Pickup
                </button>
                {selected.length > 0 && (
                  <button
                    onClick={() => setQuantities({})}
                    className="mt-4 w-full text-[11px] text-[#7c8861] underline underline-offset-4"
                  >
                    Clear estimate
                  </button>
                )}
                <p className="mt-4 text-[10px] leading-4 text-[#939783]">
                  Indicative cleaning estimate. Final weight, garment assessment, applicable taxes
                  and any delivery charges are confirmed by our team.
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={`${container} py-20 lg:py-24`}>
          <SectionTitle
            badge="SEAMLESS PROCESS"
            title="How Mr.cleanZO Works"
            description="Effortless doorstep garment care in 3 simple steps."
          />
          <div className="grid gap-9 md:grid-cols-3">
            {[
              [
                '01',
                '📱',
                'Schedule Online / WhatsApp',
                'Book through our instant estimator or send a WhatsApp message. Choose your preferred pickup time slot.',
              ],
              [
                '02',
                '🛵',
                'Electric Valet Pickup',
                'Our uniformed valet collects your garments at your society gate or doorstep in sealed, barcoded eco-bags.',
              ],
              [
                '03',
                '✨',
                'Fresh & Crisp Delivery',
                'Cleaned with zero-PERC technology, steam-pressed, and delivered back fresh on hangers or in fold bags in 24–48 hours.',
              ],
            ].map(([step, emoji, title, text]) => (
              <article
                key={step}
                className="relative rounded-[24px] border border-line bg-[#f7f8fa] p-7 transition hover:border-olive hover:shadow-[0_15px_30px_#7b8e5b18]"
              >
                <span className="absolute top-6 right-7 text-[40px] font-extrabold text-[#e6e6dd]">
                  {step}
                </span>
                <span className="mb-6 inline-grid h-16 w-16 place-items-center rounded-[18px] border border-line bg-white text-[30px] shadow-sm">
                  {emoji}
                </span>
                <h3 className="text-[21px] font-bold tracking-tight">{title}</h3>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#626b52]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="leadership" className="border-y border-line bg-[#f7f8fa] py-20 lg:py-24">
          <div className={container}>
            <SectionTitle
              badge="DEDICATED LEADERSHIP"
              title="Meet Our Management Team"
              description="Driven by quality, transparency, and a passion for modern garment care."
            />
            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
              {team.map((person) => {
                const portrait = uploaded(person.portrait)
                return (
                  <article
                    key={person.id}
                    className="rounded-[24px] border border-line bg-white px-6 py-8 text-center transition hover:border-olive hover:shadow-lg"
                  >
                    {portrait ? (
                      <Image
                        src={portrait.url!}
                        alt={person.name}
                        width={104}
                        height={104}
                        className="mx-auto mb-5 h-[104px] w-[104px] rounded-full border-2 border-[#a0b27b] object-cover shadow-[0_7px_20px_#20281920]"
                      />
                    ) : (
                      <div className="mx-auto mb-5 grid h-[104px] w-[104px] place-items-center rounded-full bg-beige text-3xl">
                        👤
                      </div>
                    )}
                    <h3 className="text-[20px] font-bold tracking-tight">{person.name}</h3>
                    <p className="mt-2 text-[11px] leading-5 font-bold tracking-[.09em] text-olive uppercase">
                      {person.role}
                    </p>
                    <p className="mt-4 text-[13px] leading-6 text-[#626b52]">{person.bio}</p>
                  </article>
                )
              })}
            </div>
            {!team.length && (
              <p className="text-center text-sm text-[#626b52]">
                Meet the people behind your garment care soon.
              </p>
            )}
          </div>
        </section>

        <section id="faq" className={`${container} py-20 lg:py-24`}>
          <SectionTitle
            badge="GOT QUESTIONS?"
            title="Frequently Asked Questions"
            description="Everything you need to know about our services, pickup, and wash policies."
          />
          <div className="mx-auto max-w-[890px] space-y-3.5">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`rounded-[18px] border transition ${openFaq === faq.id ? 'border-olive bg-[#eefaff]' : 'border-line bg-white'}`}
              >
                <h3>
                  <button
                    className="flex w-full items-center justify-between gap-6 p-6 text-left text-[16px] leading-7 font-bold"
                    aria-expanded={openFaq === faq.id}
                    aria-controls={`answer-${faq.id}`}
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  >
                    {faq.question}
                    <span className={openFaq === faq.id ? 'text-olive' : 'text-ink'}>+</span>
                  </button>
                </h3>
                <div
                  id={`answer-${faq.id}`}
                  hidden={openFaq !== faq.id}
                  className="px-6 pb-6 text-[14px] leading-6 text-[#626b52]"
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#181e13] py-16 text-[#949b8d]">
        <div className={container}>
          <div className="grid gap-10 pb-16 text-[14px] leading-6 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
            <div>
              {logo && (
                <Image
                  src={logo.url!}
                  alt="Mr. Cleanzo by Sarvadaa"
                  width={120}
                  height={58}
                  className="mb-5 h-[58px] w-[120px] object-contain brightness-0 invert"
                />
              )}
              <p className="max-w-[360px]">
                Premium, eco-friendly laundry and dry cleaning services for modern urban homes and
                businesses. 100% zero-toxic PERC solvents and authentic fabric care.
              </p>
              <p className="mt-5 text-[12px] text-[#88976e]">✓ ₹50,000 Garment Protection Cover</p>
            </div>
            <div>
              <h3 className="mb-4 text-[14px] font-bold tracking-wider text-white">
                CARE SERVICES
              </h3>
              <ul className="space-y-3">
                {services.slice(0, 5).map((service) => (
                  <li key={service.id}>
                    <a href="#services" className="hover:text-white">
                      {service.title} ({service.priceLabel}
                      {service.unitLabel === 'kg' ? '/kg' : ''})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-[14px] font-bold tracking-wider text-white">QUICK LINKS</h3>
              <ul className="space-y-3">
                {[
                  ['estimator', 'Rate Estimator'],
                  ['how-it-works', 'How It Works'],
                  ['leadership', 'Leadership Team'],
                  ['faq', 'Wash Policies'],
                ].map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="hover:text-white">
                      {label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={whatsapp('Hello Mr. Cleanzo, I need help with garment care.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    WhatsApp Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-[14px] font-bold tracking-wider text-white">
                CUSTOMER CONCIERGE
              </h3>
              <div className="space-y-3">
                <p>
                  <strong className="font-semibold text-[#a7aa9d]">Helpline:</strong>{' '}
                  <a href={`tel:+${phone.replace(/\D/g, '')}`}>+91 991904-6633</a>
                </p>
                <p>
                  <strong className="font-semibold text-[#a7aa9d]">Email:</strong>{' '}
                  <a href={`mailto:${brand.email || ''}`}>{brand.email}</a>
                </p>
                <p>
                  <strong className="font-semibold text-[#a7aa9d]">Hours:</strong> Mon – Sun: 8:00
                  AM – 9:00 PM
                </p>
                <p>
                  <strong className="font-semibold text-[#a7aa9d]">Coverage:</strong> Express pickup
                  across all major service pincodes
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-4 border-t border-[#404833] pt-7 text-[12px]">
            <p>© {new Date().getFullYear()} Mr.cleanZO (Sarvadaa Services). All Rights Reserved.</p>
            <p>Designed for a cleaner, greener tomorrow.</p>
          </div>
        </div>
      </footer>

      {phone && (
        <a
          href={whatsapp('Hello Mr. Cleanzo, I’d like help with laundry and dry cleaning.')}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-5 bottom-5 z-30 flex items-center gap-3 md:right-8 md:bottom-8"
          aria-label="Chat with Mr. Cleanzo on WhatsApp"
        >
          <span className="hidden rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-white shadow-xl sm:block">
            Chat on WhatsApp
          </span>
          <span className="chat-orb relative grid h-16 w-16 place-items-center rounded-full bg-[#22d958] text-white">
            <WhatsAppIcon />
            <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#9ae7c5]" />
          </span>
        </a>
      )}

      <dialog
        ref={dialog}
        onCancel={() => setBooking(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setBooking(false)
        }}
        className="max-h-[90dvh] w-[calc(100%_-_32px)] max-w-[560px] overflow-y-auto rounded-[26px] border border-line bg-white p-7 text-ink shadow-2xl md:p-9"
      >
        <button
          onClick={() => setBooking(false)}
          className="absolute top-4 right-5 grid h-8 w-8 place-items-center rounded-full bg-beige text-lg"
          aria-label="Close pickup request"
        >
          ✕
        </button>
        {bookingStatus === 'success' ? (
          <div className="py-7 text-center">
            <div className="mb-5 text-5xl">🌿</div>
            <h2 className="text-3xl font-extrabold tracking-tight">Pickup requested!</h2>
            <p className="mt-4 text-sm leading-6 text-[#626b52]">
              Your request has been securely saved. Our team will contact you to confirm your
              coverage, pickup time and final pricing.
            </p>
            <p className="mt-4 rounded-xl bg-beige p-4 text-xs break-all">
              Reference: {bookingReference}
            </p>
            <button onClick={() => setBooking(false)} className={`${mintButton} mt-6 w-full`}>
              Back to fresh starts
            </button>
          </div>
        ) : (
          <>
            <span className="text-[12px] font-bold tracking-wider text-olive">
              DOORSTEP GARMENT CARE
            </span>
            <h2 className="mt-3 text-[30px] font-extrabold tracking-tight">
              Schedule Valet Pickup
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#626b52]">
              {areaMessage ||
                'Tell us where and when. Our team will confirm availability before your pickup.'}
            </p>
            <form onSubmit={submitPickup} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold">
                  Your name
                  <input
                    name="customerName"
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    className="mt-2 w-full rounded-xl border border-line p-3 text-sm font-normal"
                    placeholder="Full name"
                  />
                </label>
                <label className="block text-xs font-semibold">
                  Mobile number
                  <input
                    name="phone"
                    required
                    pattern="[6-9][0-9]{9}"
                    inputMode="tel"
                    autoComplete="tel-national"
                    maxLength={10}
                    className="mt-2 w-full rounded-xl border border-line p-3 text-sm font-normal"
                    placeholder="10-digit mobile"
                  />
                </label>
              </div>
              <label className="block text-xs font-semibold">
                Pincode
                <input
                  name="pincode"
                  required
                  pattern="[1-9][0-9]{5}"
                  inputMode="numeric"
                  maxLength={6}
                  defaultValue={pincode}
                  autoComplete="postal-code"
                  className="mt-2 w-full rounded-xl border border-line p-3 text-sm font-normal"
                  placeholder="6-digit pincode"
                />
              </label>
              <label className="block text-xs font-semibold">
                Pickup address
                <textarea
                  name="address"
                  required
                  minLength={10}
                  maxLength={500}
                  autoComplete="street-address"
                  rows={2}
                  className="mt-2 w-full rounded-xl border border-line p-3 text-sm font-normal"
                  placeholder="House / apartment, street and landmark"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold">
                  Preferred pickup date
                  <input
                    name="pickupDate"
                    required
                    type="date"
                    min={new Date().toLocaleDateString('en-CA')}
                    max={new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-CA')}
                    className="mt-2 w-full rounded-xl border border-line p-3 text-sm font-normal"
                  />
                </label>
                <label className="block text-xs font-semibold">
                  Preferred time
                  <select
                    name="timeWindow"
                    required
                    className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm font-normal"
                  >
                    <option value="">Choose a time</option>
                    <option value="morning">Morning · 8 AM–12 PM</option>
                    <option value="afternoon">Afternoon · 12 PM–5 PM</option>
                    <option value="evening">Evening · 5 PM–9 PM</option>
                  </select>
                </label>
              </div>
              <label className="block text-xs font-semibold">
                Garment notes <span className="font-normal">(optional)</span>
                <textarea
                  name="notes"
                  maxLength={1000}
                  rows={2}
                  className="mt-2 w-full rounded-xl border border-line p-3 text-sm font-normal"
                  placeholder="Delicate fabrics, stains or special instructions"
                />
              </label>
              <label className="absolute -left-[9999px]" aria-hidden="true">
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              {selected.length > 0 && (
                <p className="rounded-xl bg-beige p-4 text-xs leading-5">
                  {count} selected · Estimated cleaning subtotal: <strong>{money(subtotal)}</strong>
                  <br />
                  Your selected garments will be included with this request.
                </p>
              )}
              {bookingError && (
                <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700">
                  {bookingError}
                </p>
              )}
              <button
                disabled={bookingStatus === 'saving'}
                className={`${mintButton} w-full`}
                type="submit"
              >
                {bookingStatus === 'saving' ? 'Saving your request…' : '⚡ Request Valet Pickup'}
              </button>
              <p className="text-center text-[10px] leading-5 text-[#878d7c]">
                A request is not a confirmed booking. Our team confirms your pincode coverage, time
                and final charges.
              </p>
            </form>
          </>
        )}
      </dialog>
    </>
  )
}
