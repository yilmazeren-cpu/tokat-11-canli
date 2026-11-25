# Tokat Hat 11 (TOKİ Evleri) — Canlı Otobüs Takip (Netlify Paketi)

Bu paket, Kentkart API üzerinden Tokat **11 numaralı TOKİ Evleri** otobüs hattının güzergahını, duraklarını, hareket saatlerini ve canlı araç konumlarını CORS engeline takılmadan göstermek için **sıfır bağımlılıklı Netlify Functions** proxy sunucusu ile hazırlanmıştır.

## Dosya Yapısı

```text
.
├── index.html                   # Harita ve canlı takip arayüzü (/api üzerinden çalışır)
├── netlify.toml                 # /api/* -> /.netlify/functions/proxy/:splat yönlendirmesi
├── README.md                    # Kurulum rehberi
└── netlify/
    └── functions/
        └── proxy.js             # Sıfır bağımlılıklı Node.js 18+ Kentkart CORS proxy
```

> **Not:** `proxy.js` Node.js'in dahili `fetch` API'sini kullanır; bu yüzden `package.json` veya `axios` kurulumuna gerek yoktur.

## GitHub + Netlify ile Yayına Alma (Önerilen)

> **Önemli:** Netlify'ın "Drag & Drop" (sürükle-bırak) yüklemesi `netlify/functions` klasörünü çalıştırmaz. Canlı proxy'nin çalışması için projeyi GitHub üzerinden bağlamanız gerekir.

1. GitHub'da yeni bir depo (repository) oluşturun (ör. `tokat-11-canli`).
2. Bu ZIP içindeki dosyaları (`index.html`, `netlify.toml`, `README.md` ve `netlify/functions/proxy.js`) klasör yapısını bozmadan deponun kök dizinine yükleyin.
3. [app.netlify.com](https://app.netlify.com) hesabınıza giriş yapın → **Add new site** → **Import an existing project** → **GitHub** seçin.
4. Oluşturduğunuz depoyu seçin. Build ayarlarını değiştirmenize gerek yoktur (`netlify.toml` otomatik okunur). **Deploy site** butonuna basın.
5. Yayın tamamlandığında şu adresten proxy'nin çalıştığını doğrulayabilirsiniz:
   `https://SITENIZIN-ADI.netlify.app/api/health`
   Ekranda `{"ok":true,"service":"tokat-11-kentkart-proxy",...}` görünüyorsa kurulum tamamdır.

## Yerel Bilgisayarda Test Etme (İsteğe Bağlı)

Bilgisayarınızda Node.js 18+ kuruluysa proje klasöründe şu komutu çalıştırabilirsiniz:

```bash
npx netlify-cli dev
```

Tarayıcıda `http://localhost:8888` açıldığında `/api` proxy yerel olarak çalışır.

## Teknik Detaylar

- **Tokat Kentkart Bölge Kodu:** `039`
- **Hat Kodu:** `11`
- **Kullanılan Uç Nokta:** `rl1/web/pathInfo` (ilk açılışta `resultType=111111`, 10 saniyelik canlı yenilemelerde yalnızca otobüsleri çeken hafif `resultType=010000`)
- Gerekirse uygulama içindeki **Saatler & API** sekmesinden bölge veya hat kodunu değiştirip başka Tokat hatlarını da takip edebilirsiniz.

- **Harita Altlığı:** API anahtarı gerektirmeyen ücretsiz OpenStreetMap (`tile.openstreetmap.org`) katmanı ve karanlık mod uyumlu harita filtresi.
