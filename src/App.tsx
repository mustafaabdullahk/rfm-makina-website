import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, Mail, MapPin, Settings, Award, Users, Factory, CheckCircle } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pauseAutoSlide, setPauseAutoSlide] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const menuItems = [
    { id: 'home', label: 'Anasayfa' },
    { id: 'about', label: 'Hakkımızda' },
    { id: 'services', label: 'Hizmetler' },
    { id: 'machines', label: 'Makine Parkuru' },
    { id: 'references', label: 'Referanslar' },
    { id: 'certificates', label: 'Kalite Belgeleri' },
    { id: 'contact', label: 'İletişim' }
  ];

  // --- Configuration for section-specific colors ---
  const sectionColorConfig: Record<string, { scrollbar: string; bg: string; }> = {
    home: { scrollbar: 'scrollbar-blue', bg: 'bg-blue-500' },
    about: { scrollbar: 'scrollbar-orange', bg: 'bg-orange-500' },
    services: { scrollbar: 'scrollbar-green', bg: 'bg-green-500' },
    machines: { scrollbar: 'scrollbar-blue', bg: 'bg-blue-500' },
    references: { scrollbar: 'scrollbar-red', bg: 'bg-red-500' },
    certificates: { scrollbar: 'scrollbar-orange', bg: 'bg-orange-500' },
    contact: { scrollbar: 'scrollbar-green', bg: 'bg-green-500' }
  };

  // --- useEffect to handle scrollbar color change ---
  useEffect(() => {
    const currentConfig = sectionColorConfig[activeSection];
    const htmlElement = document.documentElement;

    // Remove all previous scrollbar classes
    Object.values(sectionColorConfig).forEach(config => {
      htmlElement.classList.remove(config.scrollbar);
    });

    // Add the new scrollbar class
    if (currentConfig) {
      htmlElement.classList.add(currentConfig.scrollbar);
    }
  }, [activeSection]);

  // --- useEffect to handle IntersectionObserver ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null, // Observe from the viewport
        rootMargin: '-80px 0px 0px 0px', // Account for the 80px fixed header
        threshold: 0.2, // Trigger when 20% of the section is visible
      }
    );

    Object.keys(sectionRefs.current).forEach((key) => {
      if (sectionRefs.current[key]) {
        observer.observe(sectionRefs.current[key]);
      }
    });

    return () => {
      Object.keys(sectionRefs.current).forEach((key) => {
        if (sectionRefs.current[key]) {
          observer.unobserve(sectionRefs.current[key]);
        }
      });
    };
  }, []);

  // --- useEffect for auto-advancing carousel ---
  useEffect(() => {
    if (pauseAutoSlide) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(timer);
  }, [pauseAutoSlide]);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToPrevSlide = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentSlide(prev => (prev - 1 + 3) % 3); };
  const goToNextSlide = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentSlide(prev => (prev + 1) % 3); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Scroll Spy Navigation --- */}
      <nav className="fixed top-1/2 right-0 -translate-y-1/2 z-40 pr-2 md:pr-4 py-4">
        <ul className="flex flex-col items-center space-y-3 md:space-y-4">
          {menuItems.map((item) => (
            <li key={`${item.id}-spy`} className="relative group flex items-center">
              {/* Tooltip for Desktop */}
              <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                {item.label}
                <div className="absolute top-1/2 -translate-y-1/2 right-[-5px] w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-gray-800"></div>
              </div>
              {/* The Dot */}
              <button
                onClick={() => scrollToSection(item.id)}
                className={`block w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ease-in-out ${activeSection === item.id
                    ? `${sectionColorConfig[item.id].bg} scale-150`
                    : 'bg-gray-400 group-hover:bg-gray-600'
                  }`}
                aria-label={`Git: ${item.label}`}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* --- Header --- */}
      <header className="bg-white shadow-lg fixed w-full top-0 z-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-19 h-14 flex items-center justify-center">
                <img src="/assets/rfm-makina-logo.png" alt="RFM Makina Logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">RFM Makina</h1>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <nav className="hidden md:flex space-x-2">
                {menuItems.map((item) => (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`px-6 py-3 text-base font-medium rounded-md transition-all duration-300 ${activeSection === item.id
                          ? 'text-blue-700 bg-blue-50 font-semibold pl-8 pr-6 shadow-sm'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:pl-8'
                        }`}
                    >
                      {activeSection === item.id && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-full transition-all duration-300"></span>
                      )}
                      <span className="relative z-10">
                        {item.label}
                        {activeSection === item.id && (
                          <span className="absolute -right-1 -top-1 w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
                        )}
                      </span>
                    </button>
                  </div>
                ))}
              </nav>

              <button
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.id} className="relative">
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-right px-6 py-3 text-base font-medium rounded-md transition-all duration-300 ${activeSection === item.id
                          ? 'text-blue-700 bg-blue-50 font-semibold pr-8'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:pr-8'
                        }`}
                    >
                      {activeSection === item.id && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-full transition-all duration-300"></span>
                      )}
                      <span className="relative z-10">
                        {item.label}
                        {activeSection === item.id && (
                          <span className="absolute -right-2 -top-1 w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="pt-20">
        {/* Home Section with Carousel */}
        <section id="home" ref={(el) => (sectionRefs.current.home = el)} className="relative h-screen">
          <div className="absolute inset-0 overflow-hidden">
            <div className="relative h-full w-full">
              <div className="relative h-full w-full" onMouseEnter={() => setPauseAutoSlide(true)} onMouseLeave={() => setPauseAutoSlide(false)}>
                {[
                  { image: "./assets/hurjet.jpg", alt: "Hürjet" },
                  { image: "./assets/kaan.jpg", alt: "KAAN" },
                  { image: "./assets/sulama-sistemi.webp", alt: "Sulama Sistemi" }
                ].map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/1920x1080/1e40af/ffffff?text=${encodeURIComponent(slide.alt)}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center px-4">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                          Talaşlı İmalatta<br />
                          <span className="text-blue-300">Hassas Çözüm Ortağınız</span>
                        </h2>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                          Savunma sanayii başta olmak üzere, yüksek hassasiyetli parça üretiminde 2022'den beri hizmetinizdeyiz.
                        </p>
                        <button
                          onClick={() => scrollToSection('contact')}
                          className="bg-white text-blue-800 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                        >
                          İletişime Geçin
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={goToPrevSlide} className="absolute left-16 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10" aria-label="Önceki slayt">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={goToNextSlide} className="absolute right-16 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10" aria-label="Sonraki slayt">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>

                <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3 z-10">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-8' : 'bg-white bg-opacity-30 hover:bg-opacity-70'}`}
                      aria-label={`${index + 1}. slayta git`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" ref={(el) => (sectionRefs.current.about = el)} className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Hakkımızda</h2>
              <div className="w-20 h-1 bg-blue-800 mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  2022 yılından bu yana talaşlı imalat sektöründe faaliyet gösteren RFM Makina, farklı sektörlerdeki müşterilerine yüksek hassasiyetli parça üretimi sunan bir mühendislik firması olarak hizmet vermektedir.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Savunma sanayii başta olmak üzere; endüstriyel hidrolik sistemler, tarımsal sulama sistemleri, kalıp üretimi ve otomotiv sektörü gibi çeşitli alanlarda teknik resme uygun, kaliteli ve zamanında üretim gerçekleştirilmektedir.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  CNC tezgâhlarımız ile hem prototip hem de küçük/orta ölçekli seri üretim süreçlerinde çözüm ortağı olarak hizmet vermektedir.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <Factory className="h-6 w-6 text-blue-800 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-800">Değerlerimiz</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Kalite, güven ve sürdürülebilirlik değerlerini esas alarak, her geçen gün daha gelişmiş teknolojilerle üretim kabiliyetimiz artırılmaktadır.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-lg text-center">
                <div className="bg-blue-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Misyonumuz</h3>
                <div className="text-left space-y-2">
                  <p className="text-gray-700 text-sm">• Yüksek hassasiyetli talaşlı imalat çözümleri sunmak</p>
                  <p className="text-gray-700 text-sm">• Kaliteli, teknik şartnamelere uygun ve zamanında üretim sağlamak</p>
                  <p className="text-gray-700 text-sm">• Teknolojik altyapımızı sürekli geliştirerek sürdürülebilir değer yaratmak</p>
                </div>
              </div>

              <div className="bg-green-50 p-8 rounded-lg text-center">
                <div className="bg-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Vizyonumuz</h3>
                <div className="text-left space-y-2">
                  <p className="text-gray-700 text-sm">• Türkiye'nin talaşlı üretim alanında güvenilir çözüm sağlayıcısı olmak</p>
                  <p className="text-gray-700 text-sm">• Yüksek kalite anlayışı ve çok sektörlü üretim kabiliyetine sahip olmak</p>
                  <p className="text-gray-700 text-sm">• Yurt içi ve yurt dışında tercih edilen marka olmak</p>
                </div>
              </div>

              <div className="bg-orange-50 p-8 rounded-lg text-center">
                <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Kalite Politikamız</h3>
                <div className="text-left space-y-2">
                  <p className="text-gray-700 text-sm">• Müşteri memnuniyeti</p>
                  <p className="text-gray-700 text-sm">• Sürekli iyileştirme ve verimlilik odaklı yönetim</p>
                  <p className="text-gray-700 text-sm">• Kalite standartları ve teknik dokümantasyonlara uyum</p>
                  <p className="text-gray-700 text-sm">• İş güvenliği ve çevreye saygı</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" ref={(el) => (sectionRefs.current.services = el)} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Hizmetlerimiz</h2>
              <div className="w-20 h-1 bg-blue-800 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-fit mx-auto">
              {[
                { title: "CNC Torna ve Freze İşleme", description: "Yüksek malzeme çeşitliliği ile (Çelik, Alüminyum, Bronz, Titanyum, Kompozit) Savunma ve havacılık, Otomotiv, Makine sektörüne hassas ve yüksek doğrulukta prototip imal etmek ve seri üretim proseslerini geliştirmek\n\n• Hassas parça imalatı ve karmaşık geometrilerin işlenmesi\n• Silindirik ve dönel parçaların yüksek hassasiyetle üretimi\n• Küçük ve orta ölçekli seri üretim hizmetleri", icon: <Settings className="h-8 w-8" /> },
                { title: "Center ve Lineer Pivot Sulama Sistemi", description: "Tarımsal üretimde verimliliği ve sürdürülebilirliği hedefleyen, ihtiyaca uygun otonom sulama sistemleri gerçekleştirilmektedir. Koşullara bağlı olarak özelleştirilen ürünün gerekli mühendislik çalışmaları ve özel üretimi yapılmaktadır.\n\nRFM Lineer Sulama Sistemleri:\n• Geniş alanlarda eşit ve verimli sulama\n• Modüler yapı ile her araziye uyum\n• Dayanıklı çelik konstrüksiyon\n\nRFM Center Pivot Sulama Sistemleri:\n• Dairesel alanlarda maksimum verimlilik\n• Minimum iş gücü, düşük bakım\n• Otomasyon desteği\n\nİhtiyaca Özel Otonom Makineler:\n• Tamamen proje bazlı tasarım ve üretim\n• Uzaktan kontrol ve yapay zeka desteği\n• Endüstriyel, tarımsal ve özel kullanım alanları\n• Yüksek enerji verimliliği", icon: <Factory className="h-8 w-8" /> }
              ].map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-800 text-white p-3 rounded-lg w-fit mr-4">{service.icon}</div>
                    <h3 className="text-2xl font-semibold text-gray-800">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Machines Section */}
        <section id="machines" ref={(el) => (sectionRefs.current.machines = el)} className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Makine Parkurumuz</h2>
              <div className="w-20 h-1 bg-blue-800 mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "TAKUMI PV-1052", type: "CNC Dik İşleme Merkezi", features: ["Tabla Ölçüsü: 1100 x 500 mm", "X/Y/Z Ekseni: 1000/520/500 mm", "Maks. Yük Kapasitesi: 800 kg", "Devir: 8000 rpm", "ATC Kapasitesi: 24 takım"], image: "/assets/takumi-pv-1052.png" },
                { name: "SAMSUNG PL20/240/20MC", type: "CNC Torna Merkezi", features: ["İş Çapı: Ø520 mm", "İş Boyu: 2000 mm", "Maks. Dönüş Çapı: 680 mm", "Spindle Devri: 10-2500 rpm", "Spindle Motoru: 22/26 kW"], image: "/assets/samsung-pl20-pl240.png" },
                { name: "HYUNDAI-WIA KF3500/5A", type: "5 Eksenli CNC Torna İşleme Merkezi", features: ["İş Çapı: Ø520 mm", "İş Boyu: 2000 mm", "Maks. Dönüş Çapı: 680 mm", "Spindle Devri: 10-2500 rpm", "Spindle Motoru: 22/26 kW"], image: "/assets/hyundai-kf35005.jpg" },
                { name: "NURIS LN500W", type: "MIG/MAG Kaynak Makinesi", features: ["Sinerji kontrol", "Double pulse", "Yüksek verimlilik"], count: 2, image: "/assets/ln500w-sinerjik-double-pulse.png" },
                { name: "MCS32", type: "Sütunlu Matkap Tezgahı", features: ["Maks. Matkap Çapı: 32 mm", "Masa Ölçüsü: 500 x 600 mm", "Maks. İş Yüksekliği: 450 mm", "Spindle Devri: 150-3000 rpm", "Motor Gücü: 2.2 kW"], image: "/assets/mcs32-sutunlu-matkap-tezgahi.png" },
                { name: "MAGMAWELD RS500M", type: "Kaynak Makinesi", features: ["Kaynak Akımı: 20-500 A", "Çalışma Gerilimi: 3x400 V", "Boşta Çıkış Gerilimi: 55 V", "Duty Cycle: %60 @ 500A", "Ağırlık: 135 kg"], image: "/assets/magmaweld-rs500m.png" }
              ].map((machine, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img src={machine.image || `https://placehold.co/400x300/1e40af/ffffff?text=${encodeURIComponent(machine.name)}`} alt={machine.name} className="w-full h-48 object-cover rounded-t-lg" onError={(e) => { const target = e.target as HTMLImageElement; target.src = `https://placehold.co/400x300/1e40af/ffffff?text=${encodeURIComponent(machine.name)}`; }} />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{machine.name}</h3>
                        <p className="text-blue-600 font-medium">{machine.type}</p>
                      </div>
                      {machine.count && (<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">{machine.count} adet</span>)}
                    </div>
                    <ul className="mt-4 space-y-2">
                      {machine.features.map((feature, i) => (<li key={i} className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{feature}</span></li>))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* References Section */}
        <section id="references" ref={(el) => (sectionRefs.current.references = el)} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Referanslarımız</h2>
              <div className="w-20 h-1 bg-blue-800 mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">İş birliği yaptığımız değerli firmalar</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "TAAC", website: "taac.com.tr", image: "/assets/taachavacilik_logo.jpeg" },
                { name: "İDAK", website: "idak.com.tr", image: "/assets/idak-logo.png" },
                { name: "Altınay Savunma", website: "altinay.com", image: "/assets/altinay-savunma-logo.jpg" },
                { name: "Öztürk PT", website: "ozturkpt.com", image: "/assets/ozturk-pt-logo-black.png" },
                { name: "Gülöz Power Transmission", website: "guloz.com.tr", image: "/assets/guloz-guc-aktarma-logo.png" },
                { name: "Akın Makine", website: "akinmakina.com.tr", image: "/assets/logo-akin-makina.svg" },
                { name: "DLG Savunma", website: "dlg-tactical.com", image: "/assets/dlg-tactical.png" },
                { name: "Hidmaksan", website: "hidmaksan.com", image: "/assets/hidmaksan.svg" }
              ].map((ref, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center h-full flex flex-col justify-center items-center">
                  <a href={`https://${ref.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-32 w-full">
                    {ref.image ? (<img src={ref.image} alt={`${ref.name} logo`} className="h-24 w-24 object-contain" onError={(e) => { const target = e.target as HTMLImageElement; target.src = `https://placehold.co/96x96/1e40af/ffffff?text=${encodeURIComponent(ref.name)}`; target.className = 'h-24 w-24 object-contain'; }} />) : (<div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center"><Factory className="h-12 w-12 text-blue-800" /></div>)}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certificates Section */}
        <section id="certificates" ref={(el) => (sectionRefs.current.certificates = el)} className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Kalite Belgelerimiz</h2>
              <div className="w-20 h-1 bg-blue-800 mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Üretim süreçlerimizde kaliteyi ve güvenliği en üst seviyede tutmak için aşağıdaki uluslararası standartlara uygun şekilde faaliyet gösterilmektedir.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "ISO 9001:2015", subtitle: "Kalite Yönetim Sistemi", description: "Kalite yönetim sisteminin uluslararası standardı" },
                { title: "ISO 14001", subtitle: "Çevre Yönetim Sistemi", description: "Çevresel performans ve sürdürülebilirlik standardı" },
                { title: "ISO 45001", subtitle: "İş Sağlığı ve Güvenliği", description: "Çalışan sağlığı ve güvenliği yönetim sistemi" }
              ].map((cert, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg text-center">
                  <div className="bg-blue-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{cert.title}</h3>
                  <h4 className="text-lg font-semibold text-blue-800 mb-4">{cert.subtitle}</h4>
                  <p className="text-gray-600 text-sm">{cert.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Bu belgeler, ürünlerimizin ve hizmetlerimizin yüksek standartlarda olduğunu ve sürekli iyileştirme kültürünü benimsediğimizi göstermektedir.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" ref={(el) => (sectionRefs.current.contact = el)} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">İletişim</h2>
              <div className="w-20 h-1 bg-blue-800 mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">İletişim Bilgileri</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-800 p-3 rounded-lg"><MapPin className="h-6 w-6 text-white" /></div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Adres</h4>
                      <p className="text-gray-600">Tatlıcak Mah, Nasihat Sokak No:1/BK<br />42030 Karatay / Konya</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-800 p-3 rounded-lg"><Phone className="h-6 w-6 text-white" /></div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Telefon</h4>
                      <p className="text-gray-600">Rafet Koyuncu - +90 553 217 22 46</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-800 p-3 rounded-lg"><Mail className="h-6 w-6 text-white" /></div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">E-posta</h4>
                      <p className="text-gray-600">info@rfmmakina.com</p>
                    </div>
                  </div>
                </div>
                {/* Small map under contact info */}
                <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Konumumuz</h4>
                  <div className="relative" style={{ paddingBottom: '75%', height: 0 }}> {/* Adjusted padding for a smaller map */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3149.7129980568725!2d32.57853657642833!3d37.86700530684103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d0917453c26899%3A0x9a8c7f29d27501c6!2sRFM%20Makina%20Kal%C4%B1p%20Otomotiv!5e0!3m2!1str!2str!4v1755007795593!5m2!1str!2str"
                      width="600"
                      height="450"
                      style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="RFM Makina Konumu"
                    ></iframe>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Bize Ulaşın</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                    <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                    <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input type="tel" id="phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mesajınız *</label>
                    <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required></textarea>
                  </div>
                  <button type="submit" className="w-full bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Gönder</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; 2025 RFM Makina. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
