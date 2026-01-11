import CargoTrackingClient from './CargoTrackingClient';
import { fetchMerchantLogo } from '../utils/merchantUtils';

export default async function CargoTrackingPage() {
  const logoSrc = await fetchMerchantLogo();
  
  return <CargoTrackingClient logoSrc={logoSrc || undefined} />;
}
