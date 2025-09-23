// API Debug Script
// Bu script Laravel API'den gelen veriyi test eder

const testAPI = async () => {
  try {
    console.log('🔍 Testing Laravel API...');
    
    // Laravel API'yi test et
    const response = await fetch('http://localhost/homepage');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ API Response received:');
    console.log('📊 Products count:', data.products?.length || 0);
    
    if (data.products && data.products.length > 0) {
      console.log('🔍 First product structure:');
      const firstProduct = data.products[0];
      
      console.log('Available fields:');
      Object.keys(firstProduct).forEach(key => {
        console.log(`  - ${key}: ${typeof firstProduct[key]} = ${firstProduct[key]}`);
      });
      
      console.log('\n🎯 Required fields check:');
      console.log('  ✓ name:', firstProduct.name ? '✅' : '❌');
      console.log('  ✓ slug:', firstProduct.slug ? '✅' : '❌');
      console.log('  ✓ productImg:', firstProduct.productImg ? '✅' : '❌');
      console.log('  ✓ price fields:', firstProduct.price || firstProduct.priceCurrent ? '✅' : '❌');
      
      // Eksik alanları kontrol et
      const missingFields = [];
      if (!firstProduct.name) missingFields.push('name');
      if (!firstProduct.slug) missingFields.push('slug');
      if (!firstProduct.productImg) missingFields.push('productImg');
      if (!firstProduct.price && !firstProduct.priceCurrent) missingFields.push('price/priceCurrent');
      
      if (missingFields.length > 0) {
        console.log('⚠️  Missing required fields:', missingFields.join(', '));
      } else {
        console.log('✅ All required fields present!');
      }
    } else {
      console.log('❌ No products found in response');
    }
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('💡 Possible solutions:');
      console.log('  1. Laravel server is not running');
      console.log('  2. Wrong API URL (check NEXT_PUBLIC_API_URL)');
      console.log('  3. CORS issues');
    }
  }
};

// Node.js ortamında çalıştır
if (typeof window === 'undefined') {
  // Node.js için fetch polyfill
  const fetch = require('node-fetch');
  global.fetch = fetch;
  
  testAPI();
} else {
  // Browser ortamında
  console.log('Run this in browser console or Node.js');
}

module.exports = { testAPI };