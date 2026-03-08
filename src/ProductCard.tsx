'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';

export interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  maxQuantity?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  description,
  price,
  imageUrl,
  maxQuantity = 10,
}) => {
  const [quantity, setQuantity] = useState(1);

  const increment = useCallback(() => {
    setQuantity((prev) => Math.min(prev + 1, maxQuantity));
  }, [maxQuantity]);

  const decrement = useCallback(() => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleAddToCart = () => {
    alert(`Added ${quantity} of ${name} to cart!`);
  };

  const isMin = quantity <= 1;
  const isMax = quantity >= maxQuantity;

  return (
    <div className="border border-[rgba(51,51,51,0.12)] p-4 rounded-lg shadow-md max-w-sm bg-white">
      <div className="relative w-full h-48 rounded-md mb-4 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 384px) 100vw, 384px"
        />
      </div>
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-muted-foreground mb-2">{description}</p>
      <p className="text-lg font-bold mb-4">${price.toFixed(2)}</p>

      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          type="button"
          onClick={decrement}
          disabled={isMin}
          aria-label="Decrease quantity"
          className="min-w-[2.5rem] h-10 rounded-lg border border-[rgba(51,51,51,0.18)] bg-background text-foreground font-semibold text-lg shadow-sm hover:bg-[rgba(51,51,51,0.04)] hover:border-[rgba(51,51,51,0.22)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background transition-colors"
        >
          −
        </button>
        <span
          className="min-w-[3rem] text-center text-xl font-bold tabular-nums"
          aria-live="polite"
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={isMax}
          aria-label="Increase quantity"
          className="min-w-[2.5rem] h-10 rounded-lg border border-[rgba(51,51,51,0.18)] bg-background text-foreground font-semibold text-lg shadow-sm hover:bg-[rgba(51,51,51,0.04)] hover:border-[rgba(51,51,51,0.22)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background transition-colors"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary/90 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
