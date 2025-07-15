import React from 'react';

export default function ReviewCard({ review }: { review: { name: string; comment: string; image?: string; rating?: number } }) {
  return (
    <article className="bg-white rounded shadow flex flex-col overflow-hidden">
      {review.image && (
        <img
          src={review.image}
          alt={review.name}
          className="w-full object-cover" style={{ height: '15rem' }}
        />
      )}
      <section className="p-3 flex flex-col">
        <div className="flex items-center mb-1">
          <span className="text-yellow-500 text-sm mr-1">{'★★★★★'}</span>
          <span className="font-bold text-base text-gray-800">{review.name}</span>
        </div>
        <p className="text-gray-700 text-sm">{review.comment}</p>
      </section>
    </article>
  );
} 