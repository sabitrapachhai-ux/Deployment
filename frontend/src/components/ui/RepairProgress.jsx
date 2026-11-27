const steps = [
  { value: 'received', label: 'Received' },
  { value: 'diagnosing', label: 'Diagnosing' },
  { value: 'in_repair', label: 'In Repair' },
  { value: 'repaired', label: 'Repaired' },
  { value: 'delivered', label: 'Delivered' },
];

const currentStepByStatus = {
  received: 0,
  diagnosing: 1,
  in_repair: 2,
  waiting_for_parts: 2,
  repaired: 3,
  delivered: 4,
};

export default function RepairProgress({ status }) {
  const activeStep = currentStepByStatus[status];
  if (activeStep === undefined) return null;

  const progress = (activeStep / (steps.length - 1)) * 100;
  return <section className="repair-progress" aria-label="Repair progress">
    <div className="repair-progress-heading">
      <h2>Repair stages</h2>
      <span>{Math.round(progress)}% complete</span>
    </div>
    <div className="repair-stages" role="list">
      <div className="repair-stages-track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      {steps.map((step, index) => {
        const complete = index < activeStep;
        const current = index === activeStep;
        return <div className="repair-stage" role="listitem" key={step.value} aria-current={current ? 'step' : undefined}>
          <span className={`repair-stage-dot ${complete ? 'is-complete' : ''} ${current ? 'is-current' : ''}`} aria-hidden="true">
            {complete ? '✓' : index + 1}
          </span>
          <span className={`repair-stage-label ${current ? 'is-current' : ''}`}>{step.label}</span>
        </div>;
      })}
    </div>
  </section>;
}
