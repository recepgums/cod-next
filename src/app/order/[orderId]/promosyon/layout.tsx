import Header from '../../../components/Header';

export default function PromotionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Header />
      {children}
    </div>
  );
}


