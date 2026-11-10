import React, { Children, cloneElement, memo } from 'react';
import { ListItems } from './article';

/**
 * Reusable wrapper that automatically injects `.currentStep`
 * to child elements matching active step index(es) from `setCurrentStep`.
 */
export const AlgoSteps = memo(function ({
  currentStep = '',
  component = 'ol',
  children,
  sx,
  ...props
}) {
  const activeSteps = currentStep
    ? currentStep
        .toString()
        .split(',')
        .map((s) => Number(s.trim()))
    : [];

  return (
    <ListItems
      component={component}
      sx={{
        '& li': {
          px: 1,
          py: 0.5,
          borderRadius: 1,
          transition: 'background-color 0.25s ease-in-out',
        },
        pl: 2,
        mb: 0,
        ...sx,
      }}
      {...props}
    >
      {Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isCurrent = activeSteps.includes(index);
        const className = [
          child.props.className,
          isCurrent ? 'currentStep' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return cloneElement(child, { className });
      })}
    </ListItems>
  );
});

AlgoSteps.displayName = 'AlgoSteps';

export default AlgoSteps;
