import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function POST(request:Request) {

    const body = await request.json();

    // Ensure logs directory exists at project root
    const logsDir = path.join(process.cwd(), 'added-to-carts');
    await fs.promises.mkdir(logsDir, { recursive: true });

    // File name by month-year (MM-YYYY.txt)
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const fileName = `${pad(now.getMonth() + 1)}-${now.getFullYear()}.txt`;
    const filePath = path.join(logsDir, fileName);


    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const safe = (v: any) => (v === undefined || v === null ? '' : String(v).replace(/\r|\n/g, ' ').trim());

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



    return NextResponse.json({})
}


// DELETE isteği ile sepetten ürün silme işlevi
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        
        // Gerekli verilerin varlığını kontrol et
        const targetPhone = body?.phone;
        const targetProductId = body?.product_id;
        console.log(body);
  
        if (!targetPhone || !targetProductId) {
            return NextResponse.json(
                { message: "Eksik 'phone' veya 'product_id' parametresi." }, 
                { status: 400 }
            );
        }
  
        // Dosya yolunu oluşturma (POST ile aynı mantıkla)
        const logsDir = path.join(process.cwd(), 'added-to-carts');
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const fileName = `${pad(now.getMonth() + 1)}-${now.getFullYear()}.txt`;
        const filePath = path.join(logsDir, fileName);
  
        // 1. Dosyanın varlığını kontrol et
        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { message: "Bu aya ait kayıt dosyası bulunamadı." }, 
                { status: 200 } // Başarılı kabul edilebilir, çünkü silinecek bir şey yok
            );
        }
  
        // 2. Dosya içeriğini oku
        const fileContent = await fs.promises.readFile(filePath, { encoding: 'utf8' });
        
        // Satırlara ayır
        const lines = fileContent.trim().split('\n').filter(line => line.trim() !== '');
        
        let foundAndDeleted = false;
        
        // 3. Silinmeyecek satırları filtrele
        const updatedLines = lines.filter(line => {
            try {
                const item = JSON.parse(line);
                
                // Eğer telefon ve ürün ID'si eşleşiyorsa bu satırı DAHİL ETME
                const match = String(item.phone) === String(targetPhone) && 
                              String(item.product_id) === String(targetProductId);
                
                if (match) {
                    foundAndDeleted = true;
                    // Silinecek satır olduğu için filtre dışı bırakılır (false döndürülür)
                    return false; 
                }
                
                // Silinmeyecek satır (dahil edilir)
                return true; 
            } catch (e) {
                // JSON parse hatası olan satırları koru (veya logla)
                console.error("JSON parse hatası:", line, e);
                return true; 
            }
        });
  
        // 4. Dosyayı güncellenmiş içerikle yeniden yaz
        if (foundAndDeleted) {
            const newContent = updatedLines.join('\n') + '\n';
            await fs.promises.writeFile(filePath, newContent, { encoding: 'utf8' });
            
            return NextResponse.json({ 
                message: "Kayıt başarıyla silindi ve dosya güncellendi." 
            });
        } else {
            return NextResponse.json({ 
                message: "Belirtilen telefon ve ürün ID'sine sahip kayıt bulunamadı." 
            });
        }
  
    } catch (error) {
        console.error("Silme işlemi sırasında hata oluştu:", error);
        return NextResponse.json(
            { message: "Sunucu hatası: Silme işlemi başarısız." }, 
            { status: 500 }
        );
    }
  }