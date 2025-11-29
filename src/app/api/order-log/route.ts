import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { time } from 'console';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Ensure logs directory exists at project root
    const logsDir = path.join(process.cwd(), 'orders');
    await fs.promises.mkdir(logsDir, { recursive: true });

    // File name by month-year (MM-YYYY.txt)
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const fileName = `${pad(now.getMonth() + 1)}-${now.getFullYear()}.txt`;
    const filePath = path.join(logsDir, fileName);

    // One-line log content
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const safe = (v: any) => (v === undefined || v === null ? '' : String(v).replace(/\r|\n/g, ' ').trim());

    const line = [
      `time=${timestamp}`,
      `name=${safe(body.name)}`,
      `phone=${safe(body.phone)}`,
      `address=${safe(body.address)}`,
      `quantity=${safe(body.quantity)}`,
      `total_price=${safe(body.total_price)}`,
      `product_id=${safe(body.product_id)}`,
      `products=${safe(body.products)}`,
      `ref_url=${safe(body.ref_url)}`,
      body.order_id ? `order_id=${safe(body.order_id)}` : undefined,
    ]
      .filter(Boolean)
      .join(' | ');

      const lineObject = {
        time : timestamp,
        name : body?.name,
        phone : body?.phone,
        address: body?.address,
        quantity: body?.quantity,
        total_price: body?.total_price,
        product_id : body?.product_id,
        products: body?.products,
        ref_url: body?.ref_url
      }

    await fs.promises.appendFile(filePath, JSON.stringify(lineObject) + '\n', { encoding: 'utf8' });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Do not leak internal paths
    return NextResponse.json({ success: false, message: 'Failed to write order log.' }, { status: 500 });
  }
}




