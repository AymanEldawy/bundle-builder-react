import './Price.css';

interface PriceProps {
  price: number;
  compareAtPrice?: number;
  period?: string;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function Price({ price, compareAtPrice, period }: PriceProps) {
  const showCompare = compareAtPrice !== undefined && compareAtPrice > price;
  const suffix = period ? `/${period}` : '';

  if (price === 0) {
    return (
      <span className="price">
        {showCompare && (
          <span className="price-compare">
            {formatCurrency(compareAtPrice)}
            {suffix}
          </span>
        )}
        <span className="price-active price-free">FREE</span>
      </span>
    );
  }

  return (
    <span className="price">
      {showCompare && (
        <span className="price-compare">
          {formatCurrency(compareAtPrice)}
          {suffix}
        </span>
      )}
      <span className="price-active">
        {formatCurrency(price)}
        {suffix}
      </span>
    </span>
  );
}
