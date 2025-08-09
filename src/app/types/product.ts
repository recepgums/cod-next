export interface ProductSettings {
  alias: string;
  quantity_price: Record<string, number>;
  quantity_discount: Record<string, number>;
  cash_payment_cost: number | null;
  card_payment_cost: number | string;
  supply_cost: number | string;
  ad_cost: number | string;
  is_campaign: boolean | null;
  cloaker_url: string | null;
  unit?: string;
  variants: any[];
  og_title: string | null;
}

export interface ProductOption {
  quantity: number;
  price: number;
  original?: number;
  discount: number;
  badge: string;
  isCampaign?: boolean;
  unit?: string;
  displayText?: string;
  finalDiscount?: number;
}

export interface ProductComment {
  id: number;
  author: string;
  content: string;
  rating: number;
  photo?: string;
  order?: number | null;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  images: string[];
  options: ProductOption[];
  features: string[];
  rating: number;
  commentCount: number;
  comments: ProductComment[];
  cities: City[];
  pixels?: { platform: string; pixel_id: string }[];
  template?: string; // Added for 2-step template
  content?: string; // Added for product content
  settings?: ProductSettings;
}

export interface City {
  id: number;
  name: string;
}

// Homepage specific types
export interface HomepageProduct {
  name: string;
  imgSrc: string;
  productLink: string;
  rating?: string | null;
  priceCurrent: string;
  priceOriginal?: string | null;
  slug: string;
}