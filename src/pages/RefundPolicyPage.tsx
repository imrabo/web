export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12">
          <p className="mb-3 text-sm font-medium text-blue-600">Legal</p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Refund & Cancellation Policy
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Last updated: August 9, 2026
          </p>
        </div>

        <div className="space-y-10 leading-7 text-gray-700">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              1. Subscriptions
            </h2>
            <p>
              Our paid plans may be offered on a monthly or annual subscription
              basis. Your subscription will renew automatically unless cancelled
              before the next billing date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              2. Cancellation
            </h2>
            <p>
              You can cancel your subscription through your account settings.
              Cancellation will generally prevent the next renewal, while access
              to paid features may continue until the end of the current billing
              period.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              3. Refunds
            </h2>
            <p>
              Payments are generally non-refundable once a billing period has
              started, except where a refund is required by applicable law or
              approved by us under exceptional circumstances.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              4. Duplicate Payments
            </h2>
            <p>
              If you believe you have been charged more than once for the same
              subscription or transaction, please contact support. We will
              investigate and, where appropriate, issue a correction or refund.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              5. Failed Payments
            </h2>
            <p>
              If a recurring payment fails, we may retry the payment or
              temporarily restrict access to paid features until the payment is
              successfully completed.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              6. Service Issues
            </h2>
            <p>
              If you experience a significant billing or service issue, please
              contact our support team with the relevant transaction details.
              Refund requests will be reviewed on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              7. Contact Us
            </h2>
            <p>
              For refund, cancellation, or billing questions, please contact our
              support team.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
