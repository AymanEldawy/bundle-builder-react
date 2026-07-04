import './Badge.css';

interface BadgeProps {
  text: string;
}

export function Badge({ text }: BadgeProps) {
  return <span className="badge">{text}</span>;
}
