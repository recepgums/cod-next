import React from 'react';

export default function BuyMoreOptions() {
  const [selected, setSelected] = React.useState(0);
  const options = [
    {
      qty: 1,
      img: '/images/1.webp',
      price: '499.00TL',
      oldPrice: null,
      perItem: null,
      badge: 'Kargo Bedava',
    },
    {
      qty: 2,
      img: '/images/1.webp',
      price: '699.00TL',
      oldPrice: '998.00TL',
      perItem: 'Tanesi 350TL',
      badge: 'Kargo Bedava',
    },
    {
      qty: 3,
      img: '/images/1.webp',
      price: '899.00TL',
      oldPrice: '1497.00TL',
      perItem: 'Tanesi 300TL',
      badge: 'Kargo Bedava',
    },
  ];
  return (
    <div className="space-y-3">
      {options.map((opt, i) => (
        <div
          key={i}
          className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${selected === i ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'}`}
          onClick={() => setSelected(i)}
        >
          <img src={opt.img} alt="option" className="w-16 h-16 rounded-lg object-cover mr-3 border border-gray-200" />
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span className="font-bold text-base mr-2">{opt.qty} Adet</span>
              <span className="bg-gray-100 border border-gray-400 text-xs px-2 py-0.5 rounded ml-1 text-gray-700">{opt.badge}</span>
            </div>
            {opt.perItem && (
              <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded font-semibold mr-2">{opt.perItem}</span>
            )}
          </div>
          <div className="flex flex-col items-end">
            {opt.oldPrice && <span className="text-xs text-gray-400 line-through">{opt.oldPrice}</span>}
            <span className="font-bold text-orange-600 text-lg">{opt.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 