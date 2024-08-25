import Image from "next/image";

export default function Home() {
  return (
    <div style={{ padding: '2.25rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ flexGrow: 1 }}>
            <img
              src="TEXT_Cptn_BlockBeard.png"
              alt="Captain BlockBeard"
            />
          </div>
          <div>
            <img
              src="Cptn_BlockBeard.png"
              alt="Captain BlockBeard"
            />
          </div>
        </div>
        </div>

        <section style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href="https://twitter.com/_CaptBlockBeard"  className="bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded">Twitter</a>
            <a href="https://t.me/+jUUAq-NjBQYyY2I1" className="bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded">Telegram</a>
            <a href="https://captainblockbeard.site" className="bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded">Degen Casino</a>
          </div>
          <p></p>
      

      <div>          
        <p>Arrr! Meet Captain Blockbeard, the legendary scallywag whose tales of treasure hunts be the stuff o modern folklore. His beard, a bristlin thicket o digital coins an coins, aint just a personal trademark—it be a hoard o cryptographic treasures, reflectin his wealth an expertise in the new age o digital finance. Legend has it that Captain Blockbeards ship be powered by a core o pure blockchain</p>
          <br/>
          <p>Join Captain Blockbeard as he continues to explore the uncharted territories of decentralized finance, where each new blockchain project promises adventure an the potential for epic gains. His story be not just one o plunder but o pioneering—the digital corsair settin the sails towards a financially unbounded horizon.</p>
   
      </div>
      </section>
      </div>    
  );
}