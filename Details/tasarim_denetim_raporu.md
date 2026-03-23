**TASARIM DENETİM RAPORU**

**cigercimiqqo.github.io/cigercimiqqo**

*Restoran Web Sipariş & Vitrin Sistemi — Kapsamlı Tasarım Analizi*

Tarih: Mart 2026

Proje Tipi: White-label Restoran Web Platformu

İncelenen Sayfalar: Ana Sayfa, Menü, Hakkımızda, Galeri, İletişim, Blog

# **1\. YÖNETİCİ ÖZETİ**

Bu rapor, cigercimiqqo.github.io/cigercimiqqo adresinde yayınlanan restoran web platformunun tüm sayfalarının tasarımsal incelemesi sonucunda hazırlanmıştır. İnceleme; görsel kimlik, içerik doldurma durumu, işlevsellik, kullanıcı deneyimi (UX) ve teknik hazırlık açısından kapsamlı biçimde gerçekleştirilmiştir.

Platform altyapı ve kod yapısı olarak sağlam bir temele sahip olmakla birlikte, şu an için büyük çoğunluğu placeholder (yer tutucu) içeriklerden oluşmaktadır. Gerçek bir müşteriye ya da kullanıcıya sunulmadan önce aşağıda listelenen kritik eksikliklerin giderilmesi gerekmektedir.

**Genel Değerlendirme:**

* Toplam incelenen sayfa: 6 (Ana Sayfa, Menü, Hakkımızda, Galeri, İletişim, Blog)

* Kritik seviye sorun sayısı: 9

* Yüksek seviye sorun sayısı: 8

* Orta seviye sorun sayısı: 7

* Düşük seviye sorun sayısı: 5

# **2\. SORUN ÖZETİ TABLOSU**

Aşağıdaki tablo, sitede tespit edilen tüm tasarımsal eksiklikler ile önem derecelerini özetlemektedir.

| SAYFA | SORUN | AĞIRLIK | AÇIKLAMA |
| :---- | :---- | :---: | :---- |
| **Tüm Sayfalar** | Logo / Site adı placeholder | **KRİTİK** | *'Site Adı' ve 'Restoran' yazıları hala değiştirilmemiş* |
| **Tüm Sayfalar** | Gerçek görsel yok | **KRİTİK** | *Tüm görseller boş, hiçbir medya yüklenmemiş* |
| **Tüm Sayfalar** | Footer eksik linkler | **KRİTİK** | *'Destek' ve 'Bize Katılın' bölümleri boş* |
| **Ana Sayfa** | Hero başlık placeholder | **KRİTİK** | *'Başlık Buraya' metni canlıda görünüyor* |
| **Ana Sayfa** | Sayaçlar sıfır gösteriyor | **KRİTİK** | *0+ Yıllık Deneyim, 0K+ Müşteri animasyonu bozuk* |
| **Ana Sayfa** | Galeri bölümü boş | **KRİTİK** | *Ana sayfadaki Mekanımızdan Kareler bölümünde görsel yok* |
| **Menü** | Tüm içerik boş / sadece yükleniyor | **KRİTİK** | *Sayfa yalnızca 'Yükleniyor...' yazısını gösteriyor* |
| **Galeri** | Sayfa tamamen boş | **KRİTİK** | *Başlık var, içerik yok, tek bir fotoğraf bile yüklenmemiş* |
| **Blog** | Sayfa tamamen boş | **KRİTİK** | *Yalnızca 'Yükleniyor...' gösteriliyor, içerik yok* |
| **Tüm Sayfalar** | Favicon eksik | **YÜKSEK** | *Tarayıcı sekmesinde varsayılan ikon görünüyor* |
| **Tüm Sayfalar** | Mobil menü test edilmedi | **YÜKSEK** | *Hamburger menü davranışı gözlemlenemedi* |
| **Ana Sayfa** | CTA butonları işlevsiz alanlar | **YÜKSEK** | *Rezervasyon / Sipariş butonları gerçek akışa bağlı değil* |
| **Ana Sayfa** | Lezzet Bir Telefon Kadar Yakın CTA bölümü | **YÜKSEK** | *Telefon numarası / sipariş linki boş* |
| **Hakkımızda** | Sayısal veriler placeholder | **YÜKSEK** | *Yıllık deneyim, çalışan sayısı gibi veriler girilmemiş* |
| **Hakkımızda** | Ekip/Usta görseli yok | **YÜKSEK** | *Usta görseli için alan var ama görsel boş* |
| **İletişim** | Google Maps embed placeholder | **YÜKSEK** | *Sayfa üzerinde gerçek iframe kodu yerine açıklama metni var* |
| **İletişim** | Form backend bağlantısı belirsiz | **YÜKSEK** | *Form gönderildiğinde ne olacağı belli değil* |
| **Tüm Sayfalar** | Renk paleti tutarsızlığı | **ORTA** | *Hero ve footer arka plan renkleri arasında uyum eksik* |
| **Tüm Sayfalar** | Tipografi hiyerarşisi zayıf | **ORTA** | *H1/H2/body font boyutu farkları yeterince belirgin değil* |
| **Tüm Sayfalar** | Boşluk (spacing) tutarsızlığı | **ORTA** | *Bölümler arası padding/margin standardize edilmemiş* |
| **Tüm Sayfalar** | Newsletter formu işlevsiz | **ORTA** | *Footer'daki e-bülten input alanı çalışmıyor* |
| **Ana Sayfa** | Özellik ikonları genel | **ORTA** | *Kömür Ateşi, Taze Malzeme ikonları çok jenerik* |
| **Hakkımızda** | Değerler bölümü görsel desteksiz | **ORTA** | *4 değer kartı yalnızca metinden oluşuyor, ikon/görsel yok* |
| **İletişim** | Adres bilgisi eksik | **ORTA** | *Fiziksel adres, telefon ve e-posta bilgileri girilmemiş* |
| **Tüm Sayfalar** | Hover efektleri eksik | **DÜŞÜK** | *Buton ve linklerde hover animasyonu tutarsız* |
| **Tüm Sayfalar** | Sayfa geçiş animasyonları | **DÜŞÜK** | *Sayfalar arası Framer Motion geçişleri aktif değil* |
| **Tüm Sayfalar** | 404 sayfası tasarımlanmamış | **DÜŞÜK** | *Var olmayan URL'ler için özel 404 tasarımı yok* |
| **Tüm Sayfalar** | Sosyal medya linkleri boş | **DÜŞÜK** | *Footer'daki sosyal medya alanı/ikonları eklenmemiş* |
| **İletişim** | Çalışma saati görseli | **DÜŞÜK** | *Saatler düz metin olarak verilmiş, görsel takvim/ikon yok* |

# **3\. SAYFA BAZLI DETAYLI ANALİZ**

## **3.1 Ana Sayfa (/)**

**Tespit Edilen Sorunlar**

* Hero bölümünde başlık metni hala 'Başlık Buraya' şeklinde placeholder olarak görünmektedir. Bu durum, projenin henüz canlıya hazır olmadığını açıkça ortaya koymakta ve profesyonel bir izlenim vermemektedir.

* Alt başlık 'Alt başlık italik' şeklinde yazılmış, bu da hero'nun hiç doldurulmadığını göstermektedir.

* İstatistik sayaçları (Yıllık Deneyim, Mutlu Müşteri, Çeşit Lezzet, Ortalama Puan) tümü 0 veya 0.0 olarak kalmaktadır. Sayaç animasyonu ya çalışmamakta ya da gerçek değerler admin panelinden girilmemiştir.

* 'Mekanımızdan Kareler' galeri bölümü ana sayfada yer almasına rağmen herhangi bir fotoğraf içermemektedir.

* 'Lezzet Bir Telefon Kadar Yakın' CTA bölümünde telefon numarası verilmemiştir.

* Mirasımız bölümündeki usta görseli tamamen boştur.

* 'Menüyü İncele' ve 'Rezervasyon Yap' CTA butonları görsel olarak mevcuttur ancak rezervasyon akışı tanımlı değildir.

**Öneriler**

* Hero başlık ve alt başlıklarını admin panelinden gerçek restoran metinleriyle doldurun.

* İstatistik değerlerini Firebase'den çekerek animasyonun doğru çalıştığını test edin.

* En az 4-6 adet mekan/yemek fotoğrafı yükleyerek galeri ve ana sayfa bölümlerini doldurun.

* Telefon numarası ve iletişim bilgilerini admin panelinden ekleyin.

## **3.2 Menü Sayfası (/menu)**

**Tespit Edilen Sorunlar**

* Sayfa yalnızca 'Yükleniyor...' durumunda kalmakta, herhangi bir ürün veya kategori görüntülenememektedir. Bu, Firebase bağlantısında ya da veri yapısında kritik bir sorun olduğuna işaret etmektedir.

* Hiçbir kategori oluşturulmamış ya da admin paneline ürün girilmemiştir.

* Loading state sonsuz döngüde kalmakta, kullanıcıya hata mesajı gösterilmemektedir.

* Sepet işlevselliği test edilememektedir çünkü ürün içeriği mevcut değildir.

* Filtreleme, arama ve rozet sistemleri (En Çok Satan, Yeni, Öne Çıkan) görsel olarak değerlendirilememiştir.

**Öneriler**

* Firebase Firestore'da en az 2-3 kategori ve 5-10 ürün oluşturarak sayfa içeriğini test edin.

* Loading durumu sonsuz kaldığında kullanıcıya 'Menü yüklenemedi, lütfen tekrar deneyin' gibi bir hata mesajı gösterin.

* Skeleton loading (iskelet yükleme) UI'ı eklenerek boş sayfa izlenimi ortadan kaldırılabilir.

## **3.3 Hakkımızda Sayfası (/hakkimizda)**

**Tespit Edilen Sorunlar**

* Sayfa içerik yapısı doğru kurulmuş olmakla birlikte, tüm metinler generic (jenerik) örnek metinlerden oluşmaktadır (gerçek restoran hikayesi yok).

* Usta / ekip görseli için ayrılmış alan tamamen boştur.

* Değerler bölümündeki 4 kart yalnızca metinden oluşmaktadır; ikon veya görsel bulunmamaktadır.

* Sayısal başarı göstergeleri (yıllık deneyim, müşteri sayısı vb.) hiç girilmemiştir.

* Herhangi bir sertifika, ödül veya medya atıfı bölümü bulunmamaktadır.

**Öneriler**

* Restoranın gerçek kuruluş hikayesini ve usta profilini ekleyin.

* Değerler kartlarına SVG ikon veya küçük illüstrasyon entegre edin.

* Gerçek başarı verilerini (35+ yıl, X müşteri vb.) admin panelinden doldurun.

## **3.4 Galeri Sayfası (/galeri)**

**Tespit Edilen Sorunlar**

* Sayfa yalnızca başlıktan (Kareler / Galeri) ibarettir; içerik tamamen boştur.

* Tek bir fotoğraf bile yüklenmemiştir.

* Fotoğraf filtreleme, lightbox/modal görüntüleme, kategori bazlı gruplama gibi özellikler değerlendirilememiştir.

* Boş galeri sayfası, ziyaretçi güvenini olumsuz etkiler ve sitenin terk edilmesine yol açar.

**Öneriler**

* Cloudinary üzerinden en az 8-12 yemek ve mekan fotoğrafı yükleyin.

* Fotoğrafları kategori bazlı (Yemekler, Mekan, Etkinlikler) gruplayın.

* Lightbox veya modal ile büyütme özelliği ekleyin.

## **3.5 İletişim Sayfası (/iletisim)**

**Tespit Edilen Sorunlar**

* Google Maps embed alanında gerçek harita yerine 'Buraya Google Maps embed kodu eklenecek' şeklinde açıklama metni mevcuttur. Bu, sayfada açıkça görünmekte ve profesyonellikten uzak bir izlenim yaratmaktadır.

* İletişim bilgileri bölümünde yalnızca çalışma saatleri mevcuttur; adres, telefon, e-posta gibi temel bilgiler girilmemiştir.

* İletişim formu görsel olarak tamamdır ancak backend entegrasyonu (Firebase, e-posta servisi vb.) doğrulanamamıştır.

* Form gönderimi sonrasında kullanıcıya ne tür bir geri bildirim (başarı/hata mesajı) gösterileceği belirsizdir.

**Öneriler**

* Admin panelinden Google Maps API key'i girerek harita embed'ini aktif edin.

* Telefon, adres ve e-posta bilgilerini iletişim ayarlarından doldurun.

* Form submit sonrası açık bir başarı mesajı veya yönlendirme ekleyin.

## **3.6 Blog Sayfası (/blog)**

**Tespit Edilen Sorunlar**

* Sayfa tıpkı menü gibi sonsuz 'Yükleniyor...' durumunda kalmaktadır.

* Hiçbir blog yazısı oluşturulmamıştır.

* Blog listeleme, kategori filtreleme, tarih sıralama ve yazar bilgisi gibi tasarım elementleri değerlendirilememiştir.

* Blog, SEO açısından en değerli sayfalardan biri olmasına rağmen tamamen boştur.

**Öneriler**

* En az 1-2 örnek blog yazısı oluşturarak sayfa düzenini test edin.

* Kategori ve tarih bazlı filtreleme UI'ını görünür kılın.

* SEO meta taglarının blog yazılarına doğru uygulandığını doğrulayın.

# **4\. GENEL TASARIMSAL EKSİKLİKLER**

## **4.1 Marka Kimliği & İçerik**

Sitenin tamamında restorana ait herhangi bir gerçek kimlik unsuru bulunmamaktadır. Bu durum, projenin white-label yapısının henüz müşteri için yapılandırılmadığını göstermektedir.

* Logo: Tarayıcı sekmesinde ve navigasyonda 'Restoran' yazısı görünmektedir. Gerçek logo görseli veya markaya özel font uygulanmamıştır.

* Renk paleti: Site genelinde tutarlı bir renk şeması uygulanmış görünse de hero, bölüm arkaplanları ve footer arasındaki renk geçişleri bazı sayfalarda uyumsuzluk yaratmaktadır.

* Tipografi: Başlık ve gövde metin boyutları arasındaki hiyerarşi bazı bölümlerde yeterince belirgin değildir.

* Favicon: Tarayıcı sekmesinde varsayılan ikon görünmektedir; restorana özgü favicon eklenmemiştir.

## **4.2 Navigasyon & Footer**

* Navigasyon bar işlevsel görünmektedir ancak aktif sayfa vurgulama (active state) tutarsızdır.

* Footer'daki 'Destek' bölümü tamamen boştur — linkler girilmemiştir.

* Footer'daki 'Bize Katılın' e-bülten formu görsel olarak mevcuttur ancak herhangi bir servis (Mailchimp, Firebase vb.) ile entegre edilmemiştir.

* Sosyal medya alanı footer'da yer almakta fakat ikonlar veya linkler eklenmemiştir.

* Mobil hamburger menü davranışı statik HTML üzerinden değerlendirilememiştir.

## **4.3 Görsel & Medya**

* Sitede tek bir gerçek görsel dahi bulunmamaktadır. Cloudinary entegrasyonu kurulmuş olsa da içerik yüklenmemiştir.

* Hero bölümünde arka plan görseli veya video placeholder alanı mevcut gibi görünmektedir ancak içerik boştur.

* Yemek fotoğrafları olmayan bir restoran sitesi, dönüşüm oranlarını ve kullanıcı güvenini doğrudan olumsuz etkiler.

## **4.4 Kullanıcı Deneyimi (UX)**

* Loading state yönetimi: Menü ve Blog sayfaları sonsuz yükleme döngüsünde kalmaktadır. Hata durumları için fallback UI tanımlanmamıştır.

* Boş durum (empty state) tasarımı: İçeriksiz sayfalarda kullanıcıya yönlendirici bir mesaj veya görsel gösterilmemektedir.

* Sayfa geçiş animasyonları: Framer Motion entegrasyonu yapılmış olmasına rağmen sayfa geçişlerinde belirgin bir animasyon gözlemlenmemiştir.

* 404 sayfası: Özel tasarımlı bir 404 sayfası bulunmamaktadır.

# **5\. ÖNCELİKLİ İŞ LİSTESİ**

Aşağıdaki adımlar, sitenin canlıya alınabilmesi için tamamlanması gereken kritik işleri öncelik sırasıyla listelemektedir.

**FAZA 1 — Acil (Canlıya Almadan Önce)**

* Admin panelinden site adı, logo ve renk temasını yapılandır

* Hero başlık ve alt başlığını gerçek metin ile doldur

* En az 10 ürün ve 3 kategori Firebase'e ekle (Menü sayfasını aktif et)

* En az 8 fotoğraf Cloudinary'e yükle (Galeri ve ana sayfa)

* Google Maps API key gir ve haritayı aktif et

* Adres, telefon, e-posta bilgilerini doldur

* Footer linklerini ve sosyal medya hesaplarını ekle

* Favicon yükle

**FAZA 2 — Kısa Vadeli (1-2 Hafta)**

* Loading/error state UI'larını geliştir (skeleton, hata mesajları)

* En az 2 blog yazısı yayınla

* İletişim formu backend entegrasyonunu test et

* Mobil uyumluluğu tüm sayfalarda test et

* Newsletter formunu aktif e-posta servisine bağla

* İstatistik sayaçlarının animasyonunu ve gerçek verileri doğrula

**FAZA 3 — Orta Vadeli (1 Ay)**

* Sayfa geçiş animasyonlarını aktif et ve optimize et

* SEO meta taglarını tüm sayfalarda doğrula

* Özel 404 sayfası tasarla

* Performans testi yap (Core Web Vitals)

* A/B testi için CTA buton varyantlarını dene

# **6\. SONUÇ**

Proje teknik altyapı açısından iyi tasarlanmış bir white-label restoran platformudur. Next.js 14, Firebase, Cloudinary ve Framer Motion gibi modern teknolojilerin doğru biçimde seçildiği görülmektedir. Ancak şu an itibarıyla site, gerçek içerik ve yapılandırma bakımından tamamen boş bir şablondan ibarettir.

Menü ve Blog sayfalarının sonsuz yükleme döngüsünde kalması, galeri ve görsellerin hiç eklenmemiş olması, logo/site adı gibi temel marka kimliği öğelerinin placeholder halde bırakılması, sitenin henüz herhangi bir müşteriye ya da kullanıcıya sunulmaya hazır olmadığını göstermektedir.

Bu raporda listelenen kritik ve yüksek öncelikli maddelerin tamamlanması durumunda platform, gerçek bir restoran için profesyonel düzeyde bir web varlığı oluşturacak kapasiteye sahiptir. Faza 1 işlemleri yaklaşık 1-2 gün içinde tamamlanabilir niteliktedir.

─────────────────────────────────────────

*Bu rapor otomatik site analizi ile hazırlanmıştır.*

*cigercimiqqo.github.io/cigercimiqqo — Mart 2026*