import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Yer tutucu RSS/JSON API linkleri. 
// Buraya RSS.app, RSS2JSON veya kendi API servis linklerinizi yerleştirebilirsiniz.
const X_FEED_API = process.env.X_FEED_API || "https://api.example.com/rss-to-json/x-user"; 
const LINKEDIN_FEED_API = process.env.LINKEDIN_FEED_API || "https://api.example.com/rss-to-json/linkedin-user";

async function fetchFeed(url, platform) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Gelen ham veriyi standartlaştırma şeması (Örnek RSS-to-JSON yapısına göre)
    // Servisinizin yapısına göre buradaki eşleştirmeleri güncelleyebilirsiniz.
    const items = data.items || data.articles || [];
    return items.map((item, index) => ({
      id: item.id || item.guid || `${platform}-${Date.now()}-${index}`,
      platform: platform,
      content: item.description || item.content || item.title || "",
      url: item.link || item.url || "#",
      date: item.pubDate || item.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error(`[Error] Failed to fetch feed for ${platform}:`, error.message);
    return []; // Bir platform çökerse diğerinin akışını engellememek için fallback.
  }
}

async function main() {
  console.log("Starting social media feed fetch...");

  // Paralel olarak API'leri çağır
  const [xPosts, linkedinPosts] = await Promise.all([
    fetchFeed(X_FEED_API, 'X'),
    fetchFeed(LINKEDIN_FEED_API, 'LinkedIn')
  ]);

  // Gönderileri birleştir ve tarihe göre yeniden eskiye sırala
  const allPosts = [...xPosts, ...linkedinPosts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // En güncel 10 gönderiyi sakla
  const limitPosts = allPosts.slice(0, 10);

  // Çıktı klasörünü kontrol et, yoksa oluştur
  const outputDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'social.json');
  fs.writeFileSync(outputPath, JSON.stringify(limitPosts, null, 2), 'utf-8');
  
  console.log(`Successfully saved ${limitPosts.length} posts to ${outputPath}`);
}

main().catch(err => {
  console.error("Critical error in fetch script:", err);
  process.exit(1);
});
