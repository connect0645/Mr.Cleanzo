import { useEffect, useRef, useState } from "react"
import {
  CarePromises,
  ContactDetails,
  Leadership,
  PickupCheck,
  RateEstimator,
  WhatsAppChat,
} from "./ContentSections"
import { whatsappLink } from "./catalog"

type IconName = "arrow" | "shirt" | "sparkle" | "iron" | "linen" | "leaf" | "check" | "clock" | "bag" | "heart"
interface IconProps {
  name: IconName
  size?: number
}
function Icon({ name, size = 24 }: IconProps) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    shirt: <path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4c0 4-8 4-8 0Z" />,
    sparkle: (
      <>
        <path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z" />
        <path d="m20 2 .7 2.3L23 5l-2.3.7L20 8l-.7-2.3L17 5l2.3-.7L20 2Z" />
      </>
    ),
    iron: (
      <>
        <path d="M4 10h13l4 9H3l1-9Zm3 0V6h7a3 3 0 0 1 3 3v1M3 22h18M7 14h.01M11 14h.01" />
      </>
    ),
    linen: (
      <>
        <rect x="4" y="4" width="16" height="6" rx="2" />
        <path d="M5 10a3 3 0 0 0 0 6h14M5 16a3 3 0 0 0 0 6h14M16 4v6" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 3C10 2 3 7 5 14c3 8 15 3 15-11ZM4 21 16 8M9 15v-5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    bag: (
      <>
        <path d="M5 7h14l2 14H3L5 7ZM8 8V6a4 4 0 0 1 8 0v2" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

const services: {
  icon: IconName
  title: string
  description: string
  detail: string
  tag: string
  price?: string
  unit?: string
}[] = [
  {
    icon: "shirt",
    title: "Wash, dry & fold / press",
    description:
      "Everyday favourites, gently washed, ozone-refreshed and folded or steam-pressed. Fresh, right to your door.",
    detail:
      "For your everyday cottons, T-shirts, towels and other machine-washable essentials. We follow garment care labels and separate fabrics for a thoughtful clean.",
    tag: "FOR THE EVERYDAY",
    price: "₹89",
    unit: "/ kg",
  },
  {
    icon: "sparkle",
    title: "Gentlemen’s dry cleaning",
    description:
      "Suits, blazers, sherwanis and fine shirts. PERC-free cleaning with special attention to lapels and linings.",
    detail:
      "A specialist approach for suits, occasion wear and delicate garments that need more than an everyday wash. Each item is assessed against its care label before cleaning.",
    tag: "FOR THE SPECIAL PIECES",
    price: "₹250",
    unit: "/ blazer",
  },
  {
    icon: "iron",
    title: "Steam ironing",
    description:
      "Crisp collars, smooth finishes and one less thing on your to-do list.",
    detail:
      "For clean clothes that just need a polished finish. From work shirts to daily outfits, careful pressing helps your wardrobe look its best.",
    tag: "FOR A SHARP FINISH",
  },
  {
    icon: "linen",
    title: "Curtains & home linen",
    description:
      "From blackout curtains to your favourite sheets. A deeper refresh for the place you call home.",
    detail:
      "Give bed sheets, duvet covers, towels and other home textiles a refresh. Cleaning methods depend on the fabric and individual care instructions.",
    tag: "FOR YOUR HAPPY PLACE",
    price: "₹140",
    unit: "/ curtain",
  },
  {
    icon: "sparkle",
    title: "Saree & delicate care",
    description:
      "Specialist care for Banarasi, Kanjeevaram, zari and chiffon, with traditional Charak roll-pressing.",
    detail:
      "From delicate silk sarees to designer lehengas, each piece receives a fabric assessment. Traditional Charak roll-pressing uses wooden rollers for an authentic finish. Tell our team about embellishments and special care requirements.",
    tag: "FOR YOUR HERITAGE PIECES",
    price: "₹200–₹250",
    unit: "/ saree",
  },
  {
    icon: "bag",
    title: "Sneaker & shoe spa",
    description:
      "A fresh step for sneakers, leather shoes, canvas and suede, with specialist cleaning and deodorisation.",
    detail:
      "A dedicated refresh for footwear, including deep cleaning, deodorisation and suitable protective finishes. The team assesses the material and condition before recommending a treatment.",
    tag: "FOR A FRESH STEP",
    price: "₹200–₹350",
    unit: "/ pair",
  },
  {
    icon: "linen",
    title: "Blanket & quilt care",
    description:
      "Cosy comfort, freshly cared for. Cleaning for single and double blankets, quilts, razai and duvets.",
    detail:
      "Care for bulky home comforts, including blankets, quilts and duvets. Ask the team about fabric-specific cleaning and dust-proof storage packaging. Rates shown are for single and double blankets.",
    tag: "FOR COSY EVERYDAYS",
    price: "₹400–₹500",
    unit: "/ blanket",
  },
]

const faqs = [
  [
    "How does doorstep pickup and delivery work?",
    "Use the rate estimator or message us on WhatsApp with your pincode and preferred pickup time. Our team confirms coverage, collects your garments at your doorstep or society gate, and arranges return delivery. Typical turnaround is 24–48 hours, subject to the items and service availability. Doorstep delivery is free on orders of ₹300 or more; ask the team about charges for smaller orders.",
  ],
  [
    "What makes your garment care different?",
    "Our care includes PERC-free cleaning, ozone washing and precision steam finishing. We offer everyday laundry, specialist dry cleaning, traditional saree Charak roll-pressing, home linen care and shoe spa services, with an electric valet pickup service.",
  ],
  [
    "How do you protect delicate fabrics and heavy zari work?",
    "We assess fabric, embellishments and care labels before treatment. Sarees and occasion wear receive specialist attention, including traditional Charak roll-pressing where appropriate. Please highlight fragile areas, colour concerns and any previous treatments when handing over your garments.",
  ],
  [
    "What is your satisfaction and garment-protection policy?",
    "The service includes garment protection cover advertised up to ₹50,000, subject to the applicable terms. Please contact our concierge for the full wash policy, exclusions, eligibility and the process for reporting a concern before placing your order.",
  ],
  [
    "How do I reach customer support?",
    "Call or WhatsApp +91 991904-6633, or email connect@mrcleanzo.in. Our concierge is available Monday–Sunday, 8:00 AM–9:00 PM, for pickup requests, garment-care questions and help with an order.",
  ],
  [
    "How do I choose the right service?",
    "Laundry care is ideal for machine-washable everyday items. Choose dry cleaning for delicate or specialist garments, steam ironing for clean clothes that need pressing, and home linen care for bedding and household textiles. Our service finder can help you decide.",
  ],
  [
    "Can you care for delicate fabrics?",
    "Delicate pieces need individual attention. We assess the fabric, embellishments and care label before recommending a cleaning method. Let the team know about any special care requirements when handing over your items.",
  ],
  [
    "What should I do before handing over my clothes?",
    "Empty all pockets, remove detachable accessories and point out any stains or damage. Keep care labels attached, and let the team know if an item needs special attention.",
  ],
  [
    "Can every stain be removed?",
    "Results depend on the type of stain, the fabric and how long it has been there. We take a careful approach, but complete removal cannot be guaranteed. Avoid rubbing or applying home treatments before a professional assessment.",
  ],
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [finder, setFinder] = useState(false)
  const [choice, setChoice] = useState("")
  const dialogRef = useRef<HTMLDialogElement>(null)
  const modalOpen = selected !== null || finder
  useEffect(() => {
    const dialog = dialogRef.current
    if (modalOpen) dialog?.showModal()
    else dialog?.close()
  }, [modalOpen])
  function closeModal() {
    setSelected(null)
    setFinder(false)
    setChoice("")
  }
  const recommendation = choice === "" ? null : Number(choice)
  return (
    <>
      <header
        className="header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(248, 247, 240, 0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "none",
        }}
      >
        <a href="#" className="logo-link" aria-label="Mr. Cleanzo home">
          <img
            src="/images/mr-cleanzo-logo.png"
            alt="Mr. Cleanzo by Sarvadaa"
            className="logo"
          />
        </a>
        <nav
          className={menuOpen ? "nav open" : "nav"}
          aria-label="Main navigation"
        >
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Our services
          </a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
            How it works
          </a>
          <a href="#rate-estimator" onClick={() => setMenuOpen(false)}>
            Rate estimator
          </a>
          <a href="#leadership" onClick={() => setMenuOpen(false)}>
            Leadership
          </a>
          <a href="#faqs" onClick={() => setMenuOpen(false)}>
            FAQs
          </a>
        </nav>
        <a
          className="button button-small header-cta"
          href={whatsappLink(
            "Hello Mr. Cleanzo, I’d like to request a doorstep pickup. Please help me check availability and choose a time.",
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Schedule pickup <Icon name="arrow" size={17} />
        </a>
        <button
          className="menu-button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"} <span>{menuOpen ? "−" : "+"}</span>
        </button>
      </header>

      <main>
        <section className="hero section-wrap">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> A FRESHER EVERYDAY STARTS HERE
            </div>
            <h1>
              A little care.
              <br />A whole lot
              <br />
              of <span>fresh.</span>
              <span className="heading-sparkle">
                <Icon name="sparkle" size={45} />
              </span>
            </h1>
            <p>
              Life gets busy. Let us take care of the laundry.
              <br className="desktop-break" /> Thoughtful cleaning for your
              clothes, PERC-free cleaning, and a little
              <br className="desktop-break" /> more time for you. Laundry from
              ₹89/kg.
            </p>
            <div className="hero-actions">
              <a href="#services" className="button">
                Explore our services <Icon name="arrow" size={19} />
              </a>
              <a href="#rate-estimator" className="text-link">
                Estimate your order <span>↗</span>
              </a>
            </div>
            <div className="hero-reassurance">
              <span>
                <Icon name="check" size={15} /> Expert garment care
              </span>
              <span>
                <Icon name="check" size={15} /> Freshness you can feel
              </span>
            </div>
            <PickupCheck />
          </div>
          <div className="hero-visual">
            <img
              className="hero-photo"
              src="https://images.unsplash.com/photo-1524404794194-16bae22718c0?auto=format&fit=crop&w=1100&q=85"
              alt="A neatly folded stack of soft, freshly cleaned linens"
            />
            <div className="image-label">
              <span className="label-icon">
                <Icon name="leaf" size={20} />
              </span>
              <div>
                Clean clothes. Clear mind.
                <small>4.9 / 5 · 12,000+ happy patrons</small>
              </div>
            </div>
            <div className="care-seal">
              <Icon name="sparkle" size={28} />
              <span>
                FRESHNESS
                <br />
                WITH A<br />
                <strong>personal touch</strong>
              </span>
            </div>
            <span className="visual-caption">GOOD CARE. GREAT FEELING.</span>
          </div>
        </section>

        <div
          className="benefit-strip"
          data-benefit-ticker
          role="region"
          aria-label="Our garment-care benefits"
          style={{ display: "block", overflow: "hidden", padding: 0, position: "relative" }}
        >
          <style>{`
            @keyframes cleanzo-benefit-scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            [data-benefit-ticker] > .benefit-ticker-track {
              display: flex;
              width: max-content;
              gap: 0;
              padding: 23px 0;
              animation: cleanzo-benefit-scroll 48s linear infinite;
            }
            [data-benefit-ticker] .benefit-ticker-group {
              display: flex;
              flex: 0 0 auto;
              align-items: center;
            }
            [data-benefit-ticker] .benefit-ticker-item {
              display: inline-flex;
              align-items: center;
              gap: 13px;
              padding-left: 32px;
              white-space: nowrap;
              font-size: 11px;
              font-weight: 550;
              letter-spacing: 1.1px;
              text-transform: uppercase;
            }
            [data-benefit-ticker] .benefit-ticker-divider {
              display: inline-flex;
              margin-left: 32px;
              color: #9daa8d;
            }
            [data-benefit-ticker] .benefit-ticker-divider svg { width: 10px; height: 10px; }
            [data-benefit-ticker] .benefit-motion-toggle {
              position: absolute;
              width: 1px;
              height: 1px;
              opacity: 0;
            }
            [data-benefit-ticker] .benefit-motion-control {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              z-index: 1;
              display: grid;
              place-items: center;
              width: 32px;
              height: 32px;
              border: 1px solid #cbd4be;
              border-radius: 50%;
              background: #ecefe2;
              color: #627653;
              cursor: pointer;
              box-shadow: 0 0 12px 10px #ecefe2;
            }
            [data-benefit-ticker] .benefit-motion-control svg { width: 13px; height: 13px; }
            [data-benefit-ticker] .benefit-resume-icon { display: none; }
            [data-benefit-ticker] .benefit-motion-toggle:focus-visible + label {
              outline: 2px solid #47694d;
              outline-offset: 4px;
            }
            [data-benefit-ticker] .benefit-motion-toggle:checked ~ .benefit-ticker-track {
              animation-play-state: paused;
            }
            [data-benefit-ticker] .benefit-motion-toggle:checked + label .benefit-pause-icon { display: none; }
            [data-benefit-ticker] .benefit-motion-toggle:checked + label .benefit-resume-icon { display: block; }
            @media (max-width: 760px) {
              [data-benefit-ticker] .benefit-ticker-item { font-size: 10px; }
            }
            @media (prefers-reduced-motion: reduce) {
              [data-benefit-ticker] > .benefit-ticker-track {
                animation: none;
                width: 100%;
                padding: 20px 24px;
              }
              [data-benefit-ticker] .benefit-ticker-group {
                flex-wrap: wrap;
                justify-content: center;
                gap: 18px 24px;
                width: 100%;
              }
              [data-benefit-ticker] .benefit-ticker-group[aria-hidden="true"],
              [data-benefit-ticker] .benefit-ticker-divider,
              [data-benefit-ticker] .benefit-motion-toggle,
              [data-benefit-ticker] .benefit-motion-control { display: none; }
              [data-benefit-ticker] .benefit-ticker-item {
                white-space: normal;
                padding: 0;
                line-height: 1.7;
              }
            }
          `}</style>
          <input
            id="cleanzo-benefit-pause"
            className="benefit-motion-toggle"
            type="checkbox"
            aria-label="Pause scrolling benefits"
          />
          <div className="benefit-ticker-track">
            {[0, 1].map(copy => (
              <div className="benefit-ticker-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {([
                  ["clock", "Express 24 to 48-hour turnaround"],
                  ["check", "₹50,000 garment protection cover"],
                  ["sparkle", "100% PERC-free eco solvents"],
                  ["leaf", "Gentle fabric care & zero odor"],
                  ["bag", "Free electric valet on orders over ₹300"],
                  ["iron", "Precision steam finishing & crisp creases"],
                  ["shirt", "Traditional Charak roll press for heritage silks"],
                ] as [IconName, string][]).map(([icon, text]) => (
                  <span className="benefit-ticker-item" key={text}>
                    <Icon name={icon} size={20} />
                    {text}
                    <span className="benefit-ticker-divider"><Icon name="sparkle" size={10} /></span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <CarePromises />

        <section id="services" className="services section-wrap section-space">
          <div className="section-heading">
            <div>
              <div className="eyebrow">A CLEAN FOR EVERY NEED</div>
              <h2>Your clothes. Our care.</h2>
            </div>
            <p>
              From your daily essentials to your Sunday best,
              <br />
              we give every piece the attention it deserves.
            </p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <button
                className="service-card"
                key={service.title}
                onClick={() => setSelected(index)}
              >
                <span className="service-icon">
                  <Icon name={service.icon} size={30} />
                </span>
                <span className="service-tag">{service.tag}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                {service.price && (
                  <span className="service-price">
                    {service.price} <small>{service.unit}</small>
                  </span>
                )}
                <span className="service-bottom">
                  A little more detail{" "}
                  <span className="round-arrow">
                    <Icon name="arrow" size={18} />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <RateEstimator />

        <section id="how-it-works" className="process section-wrap">
          <div className="eyebrow">LESS LAUNDRY. MORE LIVING.</div>
          <h2>Fresh, in three simple steps.</h2>
          <div className="process-grid">
            {[
              {
                title: "Schedule online / WhatsApp",
                text: "Build your estimate or send us a message. Our team confirms your preferred pickup time and service availability.",
                icon: "bag",
              },
              {
                title: "Electric valet pickup",
                text: "Our valet collects your garments at your doorstep or society gate in sealed, barcoded eco-bags.",
                icon: "sparkle",
              },
              {
                title: "Fresh & crisp delivery",
                text: "PERC-free cleaning, careful steam-pressing and a fresh finish. Delivered on hangers or in fold bags, typically in 24–48 hours.",
                icon: "shirt",
              },
            ].map((step, i) => (
              <div className="step" key={step.title}>
                <div className="step-top">
                  <span className="step-number">0{i + 1}</span>
                  <Icon name={step.icon as IconName} size={28} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="our-care" className="care section-wrap section-space">
          <div className="care-art">
            <div className="art-circle">
              <Icon name="shirt" size={116} />
              <span className="art-sparkle">
                <Icon name="sparkle" size={46} />
              </span>
            </div>
            <span className="care-art-caption">
              A little extra care goes a long way.
            </span>
            <span className="art-leaf">
              <Icon name="leaf" size={55} />
            </span>
          </div>
          <div className="care-copy">
            <div className="eyebrow">MORE THAN JUST CLEAN CLOTHES</div>
            <h2>
              Good for your clothes.
              <br />
              <span>Even better for your day.</span>
            </h2>
            <p>
              That favourite shirt. Your cosiest sheets. The outfit that makes
              you feel like you. We know it’s not just laundry — it’s the little
              things that make life feel good.
            </p>
            <p>
              At Mr. Cleanzo by Sarvadaa, we bring a thoughtful, personal touch
              to every clean. Because your clothes deserve care, and you deserve
              one less thing to worry about.
            </p>
            <div className="care-signoff">
              <Icon name="heart" size={19} /> A little care makes all the
              difference.
            </div>
          </div>
        </section>

        <Leadership />

        <section id="faqs" className="faq-section section-wrap">
          <div className="faq-intro">
            <div className="eyebrow">A FEW THINGS, CLEARED UP</div>
            <h2>
              Good questions.
              <br />
              Fresh answers.
            </h2>
            <p>A little clarity before your next clean.</p>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span className="faq-plus" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta section-wrap">
          <div>
            <div className="eyebrow">MAKE ROOM FOR A FRESH START</div>
            <h2>Less laundry. More you.</h2>
            <p>Let’s find the right care for your favourites.</p>
          </div>
          <button className="button" onClick={() => setFinder(true)}>
            Find your service <Icon name="arrow" size={19} />
          </button>
          <div className="cta-decoration">
            <Icon name="sparkle" size={110} />
          </div>
        </section>
        <ContactDetails />
      </main>
      <footer className="footer section-wrap">
        <div className="footer-top">
          <a href="#" aria-label="Back to top">
            <img
              className="logo footer-logo"
              src="/images/mr-cleanzo-logo.png"
              alt="Mr. Cleanzo by Sarvadaa"
            />
          </a>
          <p>A fresh approach to everyday care.</p>
          <a href="#services">Our services</a>
          <a href="#rate-estimator">Rates</a>
          <a href="#contact">Contact</a>
          <a href="#faqs">FAQs</a>
          <a href="#" className="back-top">
            Back to top ↑
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Mr. Cleanzo by Sarvadaa. All rights
            reserved.
          </span>
          <span>Care in every clean.</span>
        </div>
      </footer>
      <WhatsAppChat />
      <dialog
        ref={dialogRef}
        className="service-dialog"
        onCancel={closeModal}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal()
        }}
      >
        <button
          className="dialog-close"
          onClick={closeModal}
          aria-label="Close dialog"
        >
          ×
        </button>
        {selected !== null ? (
          <>
            <span className="service-icon">
              <Icon name={services[selected].icon} size={30} />
            </span>
            <div className="eyebrow">{services[selected].tag}</div>
            <h2>{services[selected].title}</h2>
            <p>{services[selected].detail}</p>
            <div className="dialog-note">
              <Icon name="leaf" size={22} />
              <span>
                Every fabric is different. Final care recommendations depend on
                your garment’s label and condition.
              </span>
            </div>
            <button className="button" onClick={closeModal}>
              Sounds good <Icon name="check" size={18} />
            </button>
          </>
        ) : (
          <>
            <div className="eyebrow">LET’S FIND YOUR FRESH</div>
            <h2>A little help choosing.</h2>
            <p>What would you like us to take care of?</p>
            <label className="select-label" htmlFor="service-choice">
              Your clothes or linens
            </label>
            <select
              id="service-choice"
              value={choice}
              onChange={(e) => setChoice(e.target.value)}
            >
              <option value="">Select what needs a refresh</option>
              <option value="0">Everyday clothes that need washing</option>
              <option value="1">Suits, occasion wear or delicates</option>
              <option value="2">Clean clothes that need ironing</option>
              <option value="3">Bedding, towels or home linens</option>
              <option value="4">Sarees, zari or delicate occasion wear</option>
              <option value="5">Sneakers or shoes</option>
              <option value="6">Blankets or quilts</option>
            </select>
            {recommendation !== null && (
              <div className="recommendation">
                <span className="eyebrow">YOUR FRESH MATCH</span>
                <h3>{services[recommendation].title}</h3>
                <p>{services[recommendation].detail}</p>
              </div>
            )}
            <button className="button" onClick={closeModal}>
              Back to the good stuff <Icon name="arrow" size={18} />
            </button>
          </>
        )}
      </dialog>
    </>
  )
}
