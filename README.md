# Tokat Canlı Otobüs Takip v3 (Otomatik Bölge Keşfi + Tüm Hatlar + Tüm Güzergah Varyantları)

Bu v3 paketi, Tokat için Kentkart canlı verilerini sabit/tahmini bölge kodlarına bağlı kalmadan **açılışta otomatik olarak** keşfeder ve Doğukent dahil tüm güzergah varyantlarını (`pathList`) eksiksiz çizer.

## v3 Yenilikleri
- **Otomatik Tokat Bölge Kodu Keşfi:** Açılışta `/api/rl1/api/v2.0/city` üzerinden Tokat'ın gerçek Kentkart bölge kodunu otomatik bulur.
- **Tüm Tokat Hat Listesi:** `/api/rl1/web/nearest/find` üzerinden Tokat'taki tüm otobüs hatlarını çeker, Hat 11 / TOKİ / Doğukent hatlarını otomatik seçer ve hızlı geçiş çipleri sunar.
- **Tüm `pathList` Varyantları:** Sadece ilk varyantı (`pathList[0]`) değil, gidiş ve dönüş yönlerindeki **tüm güzergah varyantlarını** ayrı renklerle haritaya çizer ve tüm varyantlardaki aktif otobüsleri birleştirir.
- **Yanıltıcı Yedek Güzergah Yok:** API boş `pathList` döndürdüğünde bunu yanlışlıkla "Canlı" göstermez; doğrudan **HAT VERİSİ BOŞ** uyarısı ve ham JSON tanılama kutusu sunar.
- **Anahtarsız Harita:** Ücretsiz OpenStreetMap (`tile.openstreetmap.org`) katmanı + karanlık mod filtresi.

## Dosya Yapısı
```text
.
├── index.html
├── netlify.toml
├── README.md
└── netlify/
    └── functions/
        └── proxy.js
```

## Güncelleme Adımları
1. ZIP'i bir klasöre çıkarın.
2. GitHub deponuzda **Add file → Upload files** diyerek tüm dosyaları (`index.html`, `netlify.toml`, `README.md` ve `netlify` klasörünü) üzerine yazdırıp **Commit changes** yapın.
3. Netlify yaklaşık 30-60 saniyede siteyi otomatik günceller.
4. Sitenizi yenilediğinizde Tokat bölge kodu, tüm hatlar ve Doğukent dahil gerçek güzergah varyantları otomatik yüklenir.
