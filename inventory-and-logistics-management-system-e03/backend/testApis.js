const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log(' STARTING BACKEND REST API ENDPOINT TESTS');
  console.log('==================================================');
  
  // 1. GET /suppliers
  try {
    console.log('\n[TEST 1] Testing GET /suppliers...');
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/suppliers',
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    console.log('Status Code:', res.statusCode);
    console.log('Suppliers Count:', res.body.length);
    console.log('First Seeded Supplier:', res.body[0]);
  } catch (err) {
    console.error('GET /suppliers failed:', err.message);
  }

  // 2. POST /suppliers
  let newSupplierId;
  try {
    console.log('\n[TEST 2] Testing POST /suppliers...');
    const payload = {
      supplier_name: 'Delta Alloys Corp',
      contact: 'Mark Ryan (m.ryan@deltaalloys.com)',
      stock: 1250
    };
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/suppliers',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }, payload);
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', res.body);
    newSupplierId = res.body.supplier_id;
  } catch (err) {
    console.error('POST /suppliers failed:', err.message);
  }

  // 3. GET /suppliers again to confirm insert
  try {
    console.log('\n[TEST 3] Testing GET /suppliers (to verify POST insertion)...');
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/suppliers',
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    console.log('Status Code:', res.statusCode);
    const addedSupplier = res.body.find(s => s.supplier_id === newSupplierId);
    console.log('Verified Added Supplier in DB:', addedSupplier ? 'SUCCESS' : 'FAILED');
    if (addedSupplier) {
      console.log('Added Supplier details:', addedSupplier);
    }
  } catch (err) {
    console.error('GET /suppliers check failed:', err.message);
  }

  // 4. GET /notifications
  try {
    console.log('\n[TEST 4] Testing GET /notifications...');
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/notifications',
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    console.log('Status Code:', res.statusCode);
    console.log('Notifications Count:', res.body.length);
    console.log('Latest Seeded Notification:', res.body[0]);
  } catch (err) {
    console.error('GET /notifications failed:', err.message);
  }
  
  console.log('\n==================================================');
  console.log(' REST API TESTS COMPLETED');
  console.log('==================================================');
}

runTests();
