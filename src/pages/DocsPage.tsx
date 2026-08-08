import { Link } from "react-router-dom"

const documentation = [
  {
    title: "Connectors",
    description:
      "Connect your favorite services and platforms without building integrations from scratch.",
    href: "/docs/connectors",
    topics: [
      "Create a connector",
      "Authentication",
      "Configuration",
      "Using connectors",
    ],
  },
  {
    title: "HTTP",
    description:
      "Connect to almost any API using HTTP requests with complete control over methods, headers, parameters, and request bodies.",
    href: "/docs/http",
    topics: [
      "GET, POST, PUT, PATCH, DELETE",
      "Headers & parameters",
      "Authentication",
      "Request & response handling",
    ],
  },
  {
    title: "MCP",
    description:
      "Connect MCP servers and use their tools inside your workflows and automations.",
    href: "/docs/mcp",
    topics: [
      "MCP servers",
      "Authentication",
      "Available tools",
      "Tool inputs & outputs",
    ],
  },
  {
    title: "Webhooks",
    description:
      "Receive real-time events from external services and trigger workflows automatically.",
    href: "/docs/webhooks",
    topics: [
      "Create a webhook",
      "Events",
      "Payloads",
      "Authentication & signatures",
    ],
  },
]

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-xl font-bold tracking-tight">
            YourApp
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link to="/docs" className="font-medium text-gray-900">
              Docs
            </Link>

            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="mb-4 inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600">
            Documentation
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Build, connect, and automate
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Everything you need to connect external services, APIs, MCP servers,
            and webhooks to your workflows.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold">Start here</h2>

          <p className="mt-2 text-gray-600">
            Choose the integration method that fits your use case.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {documentation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group rounded-2xl border border-gray-200 p-7 transition hover:border-gray-400 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-xl font-semibold group-hover:underline">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {item.description}
                  </p>
                </div>

                <span className="text-xl text-gray-400 transition group-hover:translate-x-1">
                  →
                </span>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-gray-600">
                {item.topics.map((topic) => (
                  <li key={topic} className="flex gap-2">
                    <span>•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* Concepts */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold">
              Which integration should I use?
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              The right option depends on what you are trying to connect and
              whether you need to send data, receive events, or use external
              tools.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold">Connectors</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Best when you want a structured integration with a supported
                service.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold">HTTP</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Best when you need to communicate with an API directly.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold">MCP</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Best when you want to use tools exposed by an MCP server.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold">Webhooks</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Best when an external service needs to send events to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example flow */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">A simple integration flow</h2>

          <p className="mt-3 text-gray-600">
            Connect a service, configure it, and use it inside your workflow.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500">Step 01</div>

            <h3 className="mt-2 font-semibold">Choose an integration</h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Select a connector, HTTP request, MCP server, or webhook.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500">Step 02</div>

            <h3 className="mt-2 font-semibold">Configure it</h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Add authentication, parameters, payloads, or other required
              configuration.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500">Step 03</div>

            <h3 className="mt-2 font-semibold">Run your workflow</h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Use the integration to send data, receive events, or execute
              external tools.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © 2026 YourApp. All rights reserved.
          </p>

          <div className="flex gap-5 text-sm">
            <Link to="/terms" className="text-gray-500 hover:text-gray-900">
              Terms
            </Link>

            <Link to="/privacy" className="text-gray-500 hover:text-gray-900">
              Privacy
            </Link>

            <Link
              to="/refund-policy"
              className="text-gray-500 hover:text-gray-900"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
