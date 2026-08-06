import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  return (
    <div className="home">
      <header className="home-nav">
        <span className="vault-mark small">
          lex<span>vault</span>
        </span>
        <Link to="/app" className="nav-link">
          arşive git →
        </Link>
      </header>

      <section className="hero">
        <p className="hero-eyebrow">kişisel kelime arşivi</p>
        <h1 className="hero-title">
          kaybolmadan önce
          <br />
          merakını yakala.
        </h1>
        <p className="hero-sub">
          film izlerken, kitap okurken, herhangi bir yerde karşına çıkan
          bir kelimeyi anında kaydet. gerisini biz hallederiz — sen sadece
          meraklı kal.
        </p>
        <Link to="/app" className="hero-cta">
          arşivlemeye başla
        </Link>
      </section>

      <section className="cycle">
        <p className="section-label">tanıdık geliyor mu?</p>
        <div className="cycle-steps">
          <div className="cycle-step">
            <span className="cycle-num">01</span>
            <p>bilmediğin bir kelimeyle karşılaşırsın</p>
          </div>
          <div className="cycle-step">
            <span className="cycle-num">02</span>
            <p>meraklanırsın, çeviriden anlamına bakarsın</p>
          </div>
          <div className="cycle-step">
            <span className="cycle-num">03</span>
            <p>birkaç dakika sonra unutursun</p>
          </div>
        </div>
        <p className="cycle-note">
          sorun motivasyon değil. sorun, kaydetmenin zahmetli olması.
        </p>
      </section>

      <section className="principles">
        <p className="section-label">nasıl çalışır</p>
        <div className="principle-grid">
          <div className="principle-card">
            <span className="principle-tag">yakala</span>
            <p>
              kelimeyi gördüğün an, saniyeler içinde kaydet — düzenlemek
              için uğraşma, kaydetmek yeter.
            </p>
          </div>
          <div className="principle-card">
            <span className="principle-tag">hatırla</span>
            <p>
              arşivin büyüdükçe, geçmişte kaydettiğin kelimeler karşına
              tekrar çıkar.
            </p>
          </div>
          <div className="principle-card">
            <span className="principle-tag">ustalaş</span>
            <p>
              her kelime bir bağlamla, bir kaynakla, bir tarihle senin
              hayatına bağlı kalır — soyut bir liste değil.
            </p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>gerçek hayat zaten en iyi müfredat. biz sadece unutmanı önlüyoruz.</p>
        <Link to="/app" className="hero-cta">
          hemen dene
        </Link>
      </footer>
    </div>
  );
}

export default Home;