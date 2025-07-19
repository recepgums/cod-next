import React from 'react';

type QuantityOption = {
  title: string;
  quantity: number;
  price: number;
  discount?: number;
};

export default function BuyMoreOptions({ options }: { options?: QuantityOption[] }) {
  const [selected, setSelected] = React.useState(0);
  // Fallback to old options if none provided
  const fallbackOptions = [
    {
      title: '1 Adet',
      quantity: 1,
      price: 499,
      discount: 0,
    },
    {
      title: '2 Adet',
      quantity: 2,
      price: 699,
      discount: 100,
    },
    {
      title: '3 Adet',
      quantity: 3,
      price: 899,
      discount: 200,
    },
  ];
  const displayOptions = options && options.length > 0 ? options : fallbackOptions;
  return (
    <div className="space-y-3">
      {displayOptions.map((opt, i) => (
        <div
          key={i}
          className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${selected === i ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'}`}
          onClick={() => setSelected(i)}
        >
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span className="font-bold text-[#212529] mr-2" style={{ fontSize: '18px', fontFamily: 'Roboto, sans-serif' }}>{opt.title}</span>
              {opt.discount && opt.discount > 0 && (
                <span className="bg-gray-100 border border-gray-400 text-xs px-2 py-0.5 rounded ml-1 text-gray-700">{opt.discount} TL indirim</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold text-orange-600 text-lg">{opt.price} TL</span>
          </div>
        </div>
      ))}
    </div>
  );
} 