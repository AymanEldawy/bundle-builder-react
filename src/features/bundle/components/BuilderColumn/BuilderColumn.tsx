import './BuilderColumn.css';
import { useBundle } from '../../hooks/useBundle';
import { getProductsByStep, getSelectedCount } from '../../state/selectors';
import { steps } from '../../state/initialState';
import { Step } from '../Step/Step';

export function BuilderColumn() {
  const { state } = useBundle();

  return (
    <section className="builder-column" aria-label="Bundle builder">
      <h1 className="builder-heading">Let&apos;s get started!</h1>
      <div className="builder-steps">
        {steps.map((step, index) => {
          const isExpanded = state.expandedStepId === step.id;
          const nextStep = steps[index + 1];
          return (
            <Step
              key={step.id}
              step={step}
              index={index}
              totalSteps={steps.length}
              isExpanded={isExpanded}
              selectedCount={getSelectedCount(state, step.id)}
              products={getProductsByStep(state, step.id)}
              nextStepTitle={isExpanded ? nextStep?.title : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
