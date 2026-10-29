import { useState } from "react"
import {
  calculateEstimate,
  catalog,
  categories,
  money,
  whatsappLink,
} from "./catalog"
import "./content.css"

export function PickupCheck() {
  const [pincode, setPincode] = useState("")
  return (
    <div className="pickup-check">
      <span className="eyebrow">FRESHNESS, RIGHT TO YOUR DOOR</span>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          window.open(
            whatsappLink(
              `Hello Mr. Cleanzo, please check pickup availability for pincode ${pincode}. I would like to arrange a laundry pickup.`,
            ),
            "_blank",
            "noopener,noreferrer",
          )
        }}
      >
        <label htmlFor="pickup-pincode">
          Check doorstep pickup in your area
        </label>
        <div>
          <input
            id="pickup-pincode"
            value={pincode}
            onChange={(event) =>
              setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            type="text"
            inputMode="numeric"
            pattern="[1-9][0-9]{5}"
            title="Enter a valid 6-digit Indian pincode"
            required
            placeholder="Your 6-digit pincode"
            autoComplete="postal-code"
          />
          <button className="button" type="submit">
            Check area ↗
          </button>
        </div>
      </form>
      <small>
        Our team confirms coverage and your pickup time on WhatsApp.
      </small>
    </div>
  )
}

export function CarePromises() {
  return (
    <section
      className="care-promises section-wrap"
      aria-label="Our care promises"
    >
      {[
        ["100% PERC-free", "Ozone wash & fabric-conscious care"],
        ["24–48 hours", "Freshly finished and delivered"],
        ["₹50,000 protection", "Garment cover, subject to terms"],
        ["Electric valet", "A lighter-footprint pickup"],
      ].map(([title, text]) => (
        <div key={title}>
          <span className="promise-mark">✓</span>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

export function RateEstimator() {
  const [category, setCategory] = useState("All items")
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const subtotal = calculateEstimate(quantities)
  const selected = catalog.filter((item) => quantities[item.id] > 0)
  const totalQuantity = selected.reduce(
    (sum, item) => sum + quantities[item.id],
    0,
  )
  const message = `Hello Mr. Cleanzo, I’d like to request a pickup.\n\n${selected.map((item) => `${item.name}: ${quantities[item.id]} ${item.unit}${quantities[item.id] === 1 ? "" : "s"} — ${money(item.price * quantities[item.id])}`).join("\n")}\n\nEstimated cleaning subtotal: ${money(subtotal)}.\nPlease confirm the final price, any delivery charges, service availability and pickup time.`
  return (
    <section
      id="rate-estimator"
      className="estimate-section section-wrap section-space"
    >
      <div className="section-heading">
        <div>
          <div className="eyebrow">A LITTLE CLARITY, BEFORE YOUR CLEAN</div>
          <h2>Your fresh-start estimate.</h2>
        </div>
        <p>
          Choose your garments. See your estimate.
          <br />
          Send it to our team to arrange your pickup.
        </p>
      </div>
      <div className="estimate-layout">
        <div className="estimate-catalog">
          <div
            className="category-tabs"
            role="group"
            aria-label="Filter care services"
          >
            {categories.map((name) => (
              <button
                key={name}
                aria-pressed={category === name}
                onClick={() => setCategory(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="estimate-items">
            {catalog
              .filter(
                (item) =>
                  category === "All items" || item.category === category,
              )
              .map((item) => (
                <div className="estimate-item" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      {money(item.price)} <span>/ {item.unit}</span>
                    </p>
                  </div>
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        setQuantities((current) => ({
                          ...current,
                          [item.id]: Math.max(0, (current[item.id] || 0) - 1),
                        }))
                      }
                      disabled={!quantities[item.id]}
                      aria-label={`Remove one ${item.name}`}
                    >
                      −
                    </button>
                    <output aria-label={`${item.name} quantity`}>
                      {quantities[item.id] || 0}
                    </output>
                    <button
                      onClick={() =>
                        setQuantities((current) => ({
                          ...current,
                          [item.id]: Math.min(99, (current[item.id] || 0) + 1),
                        }))
                      }
                      disabled={quantities[item.id] >= 99}
                      aria-label={`Add one ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <p className="estimate-disclaimer">
            Indicative rates in INR. Laundry is estimated per kilogram; final
            weight, garment assessment, taxes and any delivery charges are
            confirmed by the team before cleaning.
          </p>
        </div>
        <aside className="estimate-summary" aria-label="Your estimate">
          <div className="estimate-summary-heading">
            <h3>Your order estimate</h3>
            <span>{totalQuantity} selected</span>
          </div>
          <div className="delivery-progress">
            <span
              style={{ width: `${Math.min(100, (subtotal / 300) * 100)}%` }}
            />
          </div>
          <p className="delivery-hint" aria-live="polite">
            {subtotal >= 300
              ? "Your estimate qualifies for free doorstep delivery."
              : `Add ${money(300 - subtotal)} to reach free doorstep delivery.`}
          </p>
          <div className="order-lines">
            {selected.length ? (
              selected.map((item) => (
                <div key={item.id}>
                  <span>
                    {item.name}
                    <small>
                      {quantities[item.id]} × {money(item.price)} / {item.unit}
                    </small>
                  </span>
                  <strong>{money(quantities[item.id] * item.price)}</strong>
                </div>
              ))
            ) : (
              <p className="empty-order">
                A fresh start begins with your favourites.
                <br />
                Use + to add something to your estimate.
              </p>
            )}
          </div>
          <div className="summary-line">
            <span>Cleaning subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>Doorstep delivery</span>
            <span>{subtotal >= 300 ? "Free" : "Confirm with team"}</span>
          </div>
          <div className="summary-total" aria-live="polite">
            <span>Estimated subtotal</span>
            <strong>{money(subtotal)}</strong>
          </div>
          {selected.length ? (
            <a
              className="button"
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Send estimate on WhatsApp ↗
            </a>
          ) : (
            <button className="button" disabled>
              Add items to get started
            </button>
          )}
          <a
            className="estimate-pickup"
            href={whatsappLink(
              "Hello Mr. Cleanzo, I’d like to arrange a doorstep pickup. Please confirm availability and a suitable time.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Or ask us to arrange a pickup ↗
          </a>
          {selected.length > 0 && (
            <button
              className="clear-estimate"
              onClick={() => setQuantities({})}
            >
              Clear estimate
            </button>
          )}
          <small>
            Sending a message is a request, not a confirmed booking.
          </small>
        </aside>
      </div>
    </section>
  )
}

const team = [
  {
    name: "Mr. Prafull Yadav",
    role: "Branch Chief Executive Officer",
    image: "prafull-yadav",
    text: "The driving force behind Mr. Cleanzo, focused on service improvements, quality assurance and sustainable technology.",
  },
  {
    name: "Mr. Awanish Yadav",
    role: "Operations Manager",
    image: "awanish-yadav",
    text: "Brings deep service-management experience to reliable logistics, punctual valet pickups and seamless customer experiences.",
  },
  {
    name: "Mr. Shivam Giri",
    role: "Operations Manager",
    image: "shivam-giri",
    text: "Oversees daily plant operations, detergent formulations, fabric inspection and specialised stain-removal protocols.",
  },
  {
    name: "Mr. Ravi Singh",
    role: "Finance Manager",
    image: "ravi-singh",
    text: "Manages transparent pricing, institutional partnerships, customer-value programmes and growth initiatives.",
  },
]
export function Leadership() {
  return (
    <section id="leadership" className="leadership section-wrap">
      <div className="section-heading">
        <div>
          <div className="eyebrow">THE PEOPLE BEHIND THE CARE</div>
          <h2>Good care starts with good people.</h2>
        </div>
        <p>
          Driven by quality, transparency,
          <br />
          and a passion for modern garment care.
        </p>
      </div>
      <div className="team-grid">
        {team.map((person) => (
          <article className="team-card" key={person.name}>
            <img
              src={`/images/${person.image}.jpg`}
              alt={person.name}
              loading="lazy"
              width="80"
              height="80"
            />
            <h3>{person.name}</h3>
            <span>{person.role}</span>
            <p>{person.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ContactDetails() {
  return (
    <section id="contact" className="contact-details section-wrap">
      <div>
        <div className="eyebrow">YOUR CUSTOMER CONCIERGE</div>
        <h2>A little help? We’re here.</h2>
        <p>
          For pickup availability, special garments, care policies,
          <br />
          or simply a question before your first clean.
        </p>
        <a
          className="button"
          href={whatsappLink(
            "Hello Mr. Cleanzo, I have a question about your laundry and dry-cleaning services.",
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Talk to us on WhatsApp ↗
        </a>
      </div>
      <dl>
        <div>
          <dt>Give us a call</dt>
          <dd>
            <a href="tel:+919919046633">+91 991904-6633</a>
          </dd>
        </div>
        <div>
          <dt>Drop us a line</dt>
          <dd>
            <a href="mailto:connect@mrcleanzo.in">connect@mrcleanzo.in</a>
          </dd>
        </div>
        <div>
          <dt>Here for you, every day</dt>
          <dd>Monday–Sunday · 8:00 AM–9:00 PM</dd>
        </div>
        <div>
          <dt>Doorstep care</dt>
          <dd>Check your pincode with our team for coverage.</dd>
        </div>
      </dl>
    </section>
  )
}

export function WhatsAppChat() {
  return (
    <a
      className="whatsapp-chat"
      href={whatsappLink("Hello Mr. Cleanzo, I’d like help with my laundry.")}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M21 11.5a9 9 0 0 1-13.3 7.9L3 21l1.6-4.7A9 9 0 1 1 21 11.5Z" />
        <path d="M8 8c0 4 4 8 8 8l1-3-3-1-1 1-2-2 1-1-1-3-3 1Z" />
      </svg>
      Chat on WhatsApp
    </a>
  )
}
