const Services = () => (
  <div className="App">
    <header className="App-header">
      <h1>Palvelut</h1>
      <img
        src="/images/laura_hieronta.jpg"
        alt="My Image"
        style={{
          width: '200px', // Adjust as needed
          borderRadius: '50%', // This will make the image round
        }}
      />
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Klassinen hieronta</h2>
        <p>Klassinen hieronta rentouttaa, lievittää stressiä, vilkastuttaa verenkiertoa ja lymfaa sekä poistaa kuona-aineita.</p>
        <h2>Urheiluhieronta</h2>
        <p>Urheiluhieronta on klassista hierontaa voimakkaampi hieronta, jossa käsitellään enemmän faskioita/lihaskalvoja sekä keskitytää ongelma-alueiden avaamiseen. Hieronta mm. lievittää lihas- ja nivelkipuja, vapauttaa kalvoja ja avaa kehon tukkeumia.</p>
        <h2>Kuumakivihieronta</h2>
        <p>Kuumakivihieronta on syvärentouttava ja lihasjännityksiä laukaiseva hemmotteluhoito, joka aktivoi verenkiertoa, aineenvaihduntaa ja lymfanestekiertoa. Hieronta toteutetaan basalttikivillä ja öljyllä. Basalttikivi on vulkaaninen kivilaji, joka lämpenee helposti, pitää lämpöä hyvin ja luovuttaa sitä hitaasti</p>
        <h2>Aromahieronta</h2>
        <p>Aromahieronta on rentouttava, hemmotteleva ja hoitava hieronta keholle ja mielelle. Eteeriset öljyt (käytössä puhtaat 100% Young Living öljyt) vaikuttavat sekä ihon että hengityksen kautta. Asiakas valitsee öljyn oman olotilan sekä öljyn vaikutuksen ja tuoksun mukaan. Hieronta on kokovartalohieronta ja klassista hierontaa kevyempi.</p>
      </div>
    </header>
  </div>
)

export default Services