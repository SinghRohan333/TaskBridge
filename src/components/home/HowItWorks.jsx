const steps = [
  {
    number: "01",
    title: "Post a Task",
    description: "Describe what you need done, set a budget and deadline.",
  },
  {
    number: "02",
    title: "Get Proposals",
    description:
      "Freelancers apply with their price, timeline, and a short note.",
  },
  {
    number: "03",
    title: "Hire and Pay",
    description:
      "Pick the best fit, pay securely through Stripe, and get it done.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 md:px-6 py-16 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-h1 text-[var(--color-text-primary)] text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="text-h1 text-[var(--color-blue-light)] mb-2">
                {step.number}
              </div>
              <h3 className="text-h3 text-[var(--color-text-primary)] mb-2">
                {step.title}
              </h3>
              <p className="text-body text-[var(--color-text-secondary)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
