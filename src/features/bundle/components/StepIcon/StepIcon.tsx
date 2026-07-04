interface StepIconProps {
  name: string;
  className?: string;
}

export function StepIcon({ name, className = '' }: StepIconProps) {
  return (
    <img
      className={className}
      src={name}
      alt=""
      width={22}
      height={22}
      loading="lazy"
      aria-hidden="true"
    />
  );
}
