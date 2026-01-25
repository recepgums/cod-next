'use client';

import React, { RefObject, useEffect, useState } from 'react';
import Image from 'next/image';

interface ProductComment {
  id: number;
  author: string;
  content: string;
  rating: number;
  photo?: string;
  order?: number | null;
}

interface CommentsSectionProps {
  comments: ProductComment[];
  count: number;
  commentGridRef?: RefObject<HTMLDivElement>;
}

// Yorum resmi boyutları - CLS önleme için sabit boyutlar
const COMMENT_IMAGE_WIDTH = 172;
const COMMENT_IMAGE_HEIGHT = 229;

export default function CommentsSection({ comments, count, commentGridRef }: CommentsSectionProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!commentGridRef?.current || !comments?.length) return;

    const init = () => {
      const MasonryCtor = (window as any).Masonry;
      if (MasonryCtor && commentGridRef.current) {
        new MasonryCtor(commentGridRef.current, {
          itemSelector: '.comment-item',
          columnWidth: '.comment-item',
          percentPosition: true,
          gutter: 16,
        });
      }
    };

    if ((window as any).Masonry) {
      init();
      return;
    }

    const timer = setTimeout(() => {
      if ((window as any).Masonry) {
        init();
      } else {
        const checkMasonry = setInterval(() => {
          if ((window as any).Masonry) {
            clearInterval(checkMasonry);
            init();
          }
        }, 50);
        
        setTimeout(() => clearInterval(checkMasonry), 10000);
      }
    }, 2500);
  
    return () => {
      clearTimeout(timer);
    };
  }, [comments, commentGridRef]);

  const handleImageError = (commentId: number) => {
    setImageErrors(prev => new Set(prev).add(commentId));
  };

  return (
    <>
      {/* comments Section Title */}
      <h6 className="section-title style-1 my-30 text-center" id="comments">
        Tüm Değerlendirmeler ({count || 0})
      </h6>
      <div className="comment-grid mx-1" id="comment-container" ref={commentGridRef}>
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment, idx) => (
            <div className="comment-item" key={comment.id ?? idx}>
              <div className="comment-card">
                {comment.photo && !imageErrors.has(comment.id) && (
                  <div 
                    className="comment-img-wrapper" 
                    style={{ 
                      position: 'relative', 
                      width: '100%',
                      aspectRatio: `${COMMENT_IMAGE_WIDTH}/${COMMENT_IMAGE_HEIGHT}`,
                      marginBottom: '10px'
                    }}
                  >
                    <Image
                      src={comment.photo}
                      alt={`${comment.author} yorumu`}
                      fill
                      sizes="(max-width: 768px) 50vw, 172px"
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                      quality={75}
                      onError={() => handleImageError(comment.id)}
                      unoptimized={comment.photo.includes('dsmcdn.com')}
                    />
                  </div>
                )}
                <div className="comment-content">
                  <div>
                    <div className="star-rating mb-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <svg
                          key={starIndex}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill={starIndex < (comment.rating || 0) ? '#FFD700' : '#ccc'}
                          style={{ marginRight: '2px' }}
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <h6 className="mb-1">{comment.author}</h6>
                  </div>
                  <small>{comment.content}</small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-100">
            <p>Henüz yorum bulunmuyor.</p>
          </div>
        )}
      </div>
    </>
  );
}


