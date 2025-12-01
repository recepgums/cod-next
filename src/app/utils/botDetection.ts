import { headers } from 'next/headers';

/**
 * Bot tespiti için yardımcı fonksiyon
 * User-Agent ve diğer header bilgilerini kontrol eder
 */
export async function isBotRequest(): Promise<boolean> {
  const h = await headers();
  
  // User-Agent'ı al
  const userAgent = h.get('user-agent') || '';
  
  // Bilinen bot user-agent'ları
  const botPatterns = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'rogerbot',
    'linkedinbot',
    'embedly',
    'quora',
    'pinterest',
    'slackbot',
    'whatsapp',
    'facebookcatalog',
    'crawler',
    'spider',
    'bot',
    'curl',
    'wget',
    'python-requests',
    'apache-httpclient',
    'java',
    'go-http-client',
    'axios',
    'node-fetch',
    'scrapy',
    'selenium',
    'phantomjs',
    'headless'
  ];

  // User-Agent'ı küçük harfe çevir
  const lowerUserAgent = userAgent.toLowerCase();
  
  // Bot pattern'lerinden herhangi birini içeriyorsa bot olarak işaretle
  const isBot = botPatterns.some(pattern => lowerUserAgent.includes(pattern));
  
  
  return isBot;
}

