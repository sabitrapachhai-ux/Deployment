import resolveImageUrl from '../../utils/resolveImageUrl';

const fallbacks = {
  hero: '/images/placeholders/hero.svg',
  device: '/images/placeholders/device.svg',
  certificate: '/images/placeholders/certificate.svg',
  avatar: '/images/placeholders/avatar.svg',
  product: '/images/placeholders/product.svg',
  logo: '/images/placeholders/logo.svg',
};
export default function SmartImage({ src, alt = '', fallback = 'device', className = '', ...props }) {
  const handleError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbacks[fallback] || fallbacks.device;
  };
  return <img src={resolveImageUrl(src) || fallbacks[fallback] || fallbacks.device} alt={alt} onError={handleError} loading="lazy" className={className} {...props} />;
}
