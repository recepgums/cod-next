import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function PromosyonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Header />
      {children}
      <Footer />
    </div>
  );
}


