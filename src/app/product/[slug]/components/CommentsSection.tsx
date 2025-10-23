'use client';

import React, { RefObject, useEffect } from 'react';

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

export default function CommentsSection({ comments, count, commentGridRef }: CommentsSectionProps) {
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
    }, 2000);
  
    return () => {
      clearTimeout(timer);
    };
  }, [comments, commentGridRef]);

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
                {comment.photo && <img src={comment.photo} className="comment-img" alt="Comment Image" />}
                <div className="comment-content">
                  <div>
                    <div className="star-rating mb-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <i
                          key={starIndex}
                          className={`fas fa-star${starIndex < (comment.rating || 0) ? '' : '-o'}`}
                          style={{
                            color: starIndex < (comment.rating || 0) ? '#FFD700' : '#ccc',
                            fontSize: '14px',
                            marginRight: '2px'
                          }}
                        />
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


