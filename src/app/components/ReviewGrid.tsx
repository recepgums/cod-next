import React from 'react';
import ReviewCard from './ReviewCard';

export default function ReviewGrid({ reviews }: { reviews: Array<{ name: string; comment: string; image?: string; rating?: number }> }) {
  return (
    <section className="mx-auto max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 items-start">
      {reviews.map((review, i) => (
        <ReviewCard key={i} review={review} />
      ))}
    </section>
  );
} 