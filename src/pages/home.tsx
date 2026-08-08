type Plan = {
  name: string
  price: string
  period?: string
  description: string
  audience: string
  popular?: boolean
  features: string[]
  cta: string
}

const plans: Plan[] = [
  {
    name: "Explorer",
    price: "Free",
    description: "Try the core experience and see if it fits your workflow.",
    audience: "Best for trying the product",
    features: [
      "Core product functionality",
      "Limited usage",
      "Basic history",
      "Basic customization",
      "Standard integrations",
      "Self-service onboarding",
      "Community support",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Individual",
    price: "₹499",
    period: "/month",
    description:
      "Everything you need to use the product regularly on your own.",
    audience: "Best for individuals & freelancers",
    features: [
      "Everything in Explorer",
      "Higher usage limits",
      "Full core functionality",
      "More history & storage",
      "Advanced customization",
      "More integrations",
      "Advanced exports",
      "Automation for repetitive tasks",
      "Personal dashboards",
      "Saved workflows & templates",
      "Priority support",
    ],
    cta: "Start Individual",
  },
  {
    name: "Professional",
    price: "₹999",
    period: "/month",
    description:
      "For professionals who depend on the product as part of their daily workflow.",
    audience: "Best for power users",
    popular: true,
    features: [
      "Everything in Individual",
      "High usage limits",
      "Advanced automation",
      "Advanced workflows",
      "Bulk operations",
      "Advanced analytics & reporting",
      "Advanced integrations",
      "API access",
      "Webhooks",
      "Custom workflows",
      "Advanced templates",
      "Priority processing",
      "Priority support",
    ],
    cta: "Start Professional",
  },
  {
    name: "Business",
    price: "₹2,499",
    period: "/month",
    description:
      "For teams that need collaboration, control, and centralized management.",
    audience: "Best for teams & growing businesses",
    features: [
      "Everything in Professional",
      "Multiple users & seats",
      "Shared workspace",
      "Team collaboration",
      "Roles & permissions",
      "Admin dashboard",
      "Team-level analytics",
      "Shared workflows & templates",
      "Team usage management",
      "Centralized billing",
      "Audit history",
      "Team onboarding",
      "Priority support",
    ],
    cta: "Start Business",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "For organizations that need security, scale, customization, and dedicated support.",
    audience: "Best for larger organizations",
    features: [
      "Everything in Business",
      "Custom or unlimited usage",
      "Advanced security controls",
      "SSO",
      "Advanced permissions",
      "Audit logs",
      "Organization-level administration",
      "Custom integrations",
      "Dedicated API capacity",
      "Custom workflows",
      "Data controls",
      "Dedicated onboarding",
      "Dedicated account support",
      "SLA",
      "Custom contracts & billing",
    ],
    cta: "Contact Sales",
  },
]

const valueJourney = [
  {
    title: "Explorer",
    subtitle: "Discover",
    description: "I want to understand whether this solves my problem.",
  },
  {
    title: "Individual",
    subtitle: "Productivity",
    description: "I use it regularly for my own work.",
  },
  {
    title: "Professional",
    subtitle: "Scale",
    description: "I depend on it as part of my daily workflow.",
  },
  {
    title: "Business",
    subtitle: "Collaboration",
    description: "My team depends on it.",
  },
  {
    title: "Enterprise",
    subtitle: "Infrastructure",
    description: "My organization depends on it.",
  },
]

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12.5L9.5 17L19 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={`pricing-card ${plan.popular ? "pricing-card-popular" : ""}`}
    >
      {plan.popular && <div className="popular-badge">Most Popular</div>}

      <div className="pricing-card-header">
        <h3>{plan.name}</h3>

        <p className="plan-description">{plan.description}</p>

        <div className="plan-price">
          <span className="price">{plan.price}</span>
          {plan.period && <span className="period">{plan.period}</span>}
        </div>

        <p className="plan-audience">{plan.audience}</p>
      </div>

      <a
        href={
          plan.name === "Enterprise"
            ? "#contact"
            : plan.name === "Explorer"
              ? "#signup"
              : "#checkout"
        }
        className={`plan-button ${
          plan.popular ? "plan-button-primary" : "plan-button-secondary"
        }`}
      >
        {plan.cta}
        <ArrowIcon />
      </a>

      <div className="feature-divider" />

      <p className="includes-label">
        {plan.name === "Explorer" ? "What's included" : "Everything you need"}
      </p>

      <ul className="feature-list">
        {plan.features.map((feature) => (
          <li key={feature}>
            <span className="check">
              <CheckIcon />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function HomePage() {
  return (
    <>
      <style>{`
        :root {
          --bg: #ffffff;
          --surface: #f7f8fa;
          --surface-2: #f1f3f5;
          --text: #111827;
          --muted: #667085;
          --border: #e5e7eb;
          --primary: #111827;
          --primary-hover: #000000;
          --accent: #635bff;
          --accent-soft: #f1efff;
          --success: #16a34a;
          --radius: 18px;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--text);
          background: var(--bg);
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        .home {
          min-height: 100vh;
          overflow: hidden;
        }

        /* NAVBAR */

        .navbar {
          height: 72px;
          border-bottom: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(14px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .nav-container {
          max-width: 1180px;
          height: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 30px;
          font-size: 14px;
          color: #475467;
        }

        .nav-links a:hover {
          color: var(--text);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .login-button {
          padding: 9px 14px;
          font-size: 14px;
          font-weight: 600;
        }

        .nav-cta {
          padding: 10px 16px;
          border-radius: 9px;
          background: var(--primary);
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        /* HERO */

        .hero {
          padding: 110px 24px 90px;
          text-align: center;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(99, 91, 255, 0.09),
              transparent 40%
            ),
            white;
        }

        .hero-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          border-radius: 999px;
          background: var(--accent-soft);
          color: #5148d9;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 22px;
        }

        .hero h1 {
          max-width: 850px;
          margin: 0 auto;
          font-size: clamp(42px, 7vw, 76px);
          line-height: 0.98;
          letter-spacing: -4px;
          font-weight: 800;
        }

        .hero h1 span {
          color: var(--accent);
        }

        .hero-subtitle {
          max-width: 650px;
          margin: 28px auto 0;
          font-size: 19px;
          line-height: 1.65;
          color: var(--muted);
        }

        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 34px;
          flex-wrap: wrap;
        }

        .hero-primary,
        .hero-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 20px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
        }

        .hero-primary {
          background: var(--primary);
          color: white;
        }

        .hero-secondary {
          border: 1px solid var(--border);
          background: white;
        }

        /* VALUE JOURNEY */

        .journey-section {
          padding: 70px 24px;
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .section-container {
          max-width: 1180px;
          margin: 0 auto;
        }

        .section-heading {
          max-width: 650px;
          margin: 0 auto 50px;
          text-align: center;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 38px;
          line-height: 1.1;
          letter-spacing: -1.7px;
        }

        .section-heading p {
          margin: 16px 0 0;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.6;
        }

        .journey-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }

        .journey-card {
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: white;
        }

        .journey-number {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--surface-2);
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .journey-card h3 {
          margin: 0;
          font-size: 17px;
        }

        .journey-subtitle {
          display: block;
          margin-top: 5px;
          color: var(--accent);
          font-size: 13px;
          font-weight: 700;
        }

        .journey-card p {
          margin: 13px 0 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.55;
        }

        /* PRICING */

        .pricing-section {
          padding: 100px 24px;
        }

        .pricing-grid {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          align-items: stretch;
        }

        .pricing-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 28px 22px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: white;
          min-width: 0;
        }

        .pricing-card-popular {
          border: 2px solid var(--accent);
          padding: 27px 21px;
          box-shadow: 0 18px 50px rgba(99, 91, 255, 0.12);
        }

        .popular-badge {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          padding: 5px 12px;
          border-radius: 999px;
          background: var(--accent);
          color: white;
          font-size: 11px;
          font-weight: 800;
        }

        .pricing-card-header h3 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -0.4px;
        }

        .plan-description {
          min-height: 86px;
          margin: 12px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.55;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          gap: 3px;
          margin-top: 20px;
        }

        .price {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .period {
          color: var(--muted);
          font-size: 12px;
        }

        .plan-audience {
          min-height: 40px;
          margin: 8px 0 0;
          font-size: 12px;
          color: #475467;
          font-weight: 600;
        }

        .plan-button {
          margin-top: 20px;
          width: 100%;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .plan-button-primary {
          color: white;
          background: var(--accent);
        }

        .plan-button-primary:hover {
          background: #5148d9;
        }

        .plan-button-secondary {
          color: var(--text);
          border: 1px solid var(--border);
          background: white;
        }

        .plan-button-secondary:hover {
          background: var(--surface);
        }

        .feature-divider {
          height: 1px;
          background: var(--border);
          margin: 24px 0 20px;
        }

        .includes-label {
          margin: 0 0 14px;
          font-size: 12px;
          font-weight: 800;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #475467;
          font-size: 12px;
          line-height: 1.45;
        }

        .check {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--success);
          margin-top: 1px;
        }

        /* VALUE SECTION */

        .value-section {
          padding: 90px 24px;
          background: var(--surface);
        }

        .value-box {
          max-width: 980px;
          margin: 0 auto;
          padding: 54px;
          border-radius: 24px;
          background: white;
          border: 1px solid var(--border);
          text-align: center;
        }

        .value-box h2 {
          margin: 0;
          font-size: 38px;
          letter-spacing: -1.5px;
        }

        .value-box p {
          max-width: 680px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.65;
        }

        .value-points {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 40px;
          text-align: left;
        }

        .value-point {
          padding: 22px;
          border-radius: 14px;
          background: var(--surface);
        }

        .value-point strong {
          display: block;
          margin-bottom: 7px;
          font-size: 14px;
        }

        .value-point span {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.5;
        }

        /* CTA */

        .cta-section {
          padding: 100px 24px;
          text-align: center;
        }

        .cta-section h2 {
          margin: 0;
          font-size: clamp(34px, 5vw, 54px);
          letter-spacing: -2px;
        }

        .cta-section p {
          max-width: 570px;
          margin: 18px auto 28px;
          color: var(--muted);
          line-height: 1.6;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 22px;
          border-radius: 10px;
          background: var(--primary);
          color: white;
          font-size: 14px;
          font-weight: 700;
        }

        /* FOOTER */

        .footer {
          border-top: 1px solid var(--border);
          padding: 34px 24px;
        }

        .footer-container {
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .footer-brand {
          font-weight: 800;
        }

        .footer-copy {
          color: var(--muted);
          font-size: 13px;
        }

        .footer-links {
          display: flex;
          gap: 20px;
          color: var(--muted);
          font-size: 13px;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
          .pricing-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .journey-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 760px) {
          .nav-links {
            display: none;
          }

          .hero {
            padding: 80px 20px 70px;
          }

          .hero h1 {
            letter-spacing: -2.5px;
          }

          .pricing-section {
            padding: 70px 16px;
          }

          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
          }

          .plan-description,
          .plan-audience {
            min-height: auto;
          }

          .journey-grid {
            grid-template-columns: 1fr;
          }

          .value-box {
            padding: 35px 22px;
          }

          .value-points {
            grid-template-columns: 1fr;
          }

          .footer-container {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <main className="home">
        {/* NAVIGATION */}
        <header className="navbar">
          <div className="nav-container">
            <a href="/" className="logo">
              Imrabo
            </a>

            <nav className="nav-links">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#value">Why Us</a>
            </nav>

            <div className="nav-actions">
              <a href="/login" className="login-button">
                Log in
              </a>

              <a href="#signup" className="nav-cta">
                Get Started
              </a>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="hero-container">
            <div className="eyebrow">Built around your needs</div>

            <h1>
              Choose the level of <span>value</span> you need.
            </h1>

            <p className="hero-subtitle">
              Start simple, grow when you need more, and scale your workflow
              from individual productivity to organization-wide use.
            </p>

            <div className="hero-actions">
              <a href="#pricing" className="hero-primary">
                Explore Plans
                <ArrowIcon />
              </a>

              <a href="#value" className="hero-secondary">
                See How It Works
              </a>
            </div>
          </div>
        </section>

        {/* VALUE JOURNEY */}
        <section className="journey-section" id="features">
          <div className="section-container">
            <div className="section-heading">
              <h2>Plans that grow with your needs.</h2>

              <p>
                Each plan is designed around a different stage of usage—not
                simply a different number of features.
              </p>
            </div>

            <div className="journey-grid">
              {valueJourney.map((item, index) => (
                <div className="journey-card" key={item.title}>
                  <div className="journey-number">{index + 1}</div>

                  <h3>{item.title}</h3>

                  <span className="journey-subtitle">{item.subtitle}</span>

                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="pricing-section" id="pricing">
          <div className="section-heading">
            <h2>Find the plan that fits your workflow.</h2>

            <p>
              Start with what you need today. Upgrade when your usage, workflow,
              or team grows.
            </p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </section>

        {/* VALUE EXPLANATION */}
        <section className="value-section" id="value">
          <div className="value-box">
            <h2>You're paying for value, not feature limits.</h2>

            <p>
              Every plan is designed around what you are trying to accomplish.
              As your needs grow, your plan gives you the capabilities,
              capacity, and control required for the next stage.
            </p>

            <div className="value-points">
              <div className="value-point">
                <strong>Personal productivity</strong>
                <span>
                  Use the product to save time and get more done individually.
                </span>
              </div>

              <div className="value-point">
                <strong>Professional scale</strong>
                <span>
                  Automate more work and handle larger, more demanding
                  workflows.
                </span>
              </div>

              <div className="value-point">
                <strong>Business control</strong>
                <span>
                  Give teams the collaboration, administration, and security
                  they need.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section" id="signup">
          <h2>Start with what you need.</h2>

          <p>
            Try the core experience for free and move to a higher plan when your
            workflow requires more.
          </p>

          <a href="/signup" className="cta-button">
            Get Started Free
            <ArrowIcon />
          </a>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-container">
            <div>
              <div className="footer-brand">Imrabo</div>
              <div className="footer-copy">
                © {new Date().getFullYear()} Imrabo. All rights reserved.
              </div>
            </div>

            <div className="footer-links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
