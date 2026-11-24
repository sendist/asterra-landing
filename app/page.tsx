import Image from "next/image";
import { getMailerLiteConfig } from "./mailerlite";
import { HeroScene, PreviewScene } from "./scroll-scenes";
import { WaitlistForm } from "./waitlist-form";

const assets = "/asterra";
const instagram = "https://www.instagram.com/asterra.app/";
const tiktok = "https://www.tiktok.com/@paraappleintelligence";

const previews = [
  ["Catch stars live", "Point your iPhone at the sky and capture what you find."],
  ["Keep the night", "Save the photo, place, and notes from each observation."],
  ["Complete constellations", "Collect the stars in a constellation to reveal its artwork."],
  ["Plan your next outing", "See when meteor showers, full moons, and planetary events are coming up."],
];

const team = [
  { name: "Rafi", fullName: "Muhammad Rafi Aulia Rahmad", role: "Product Manager", file: "rafi", profile: "muhammadrafiauliarahmad" },
  { name: "Ferdi", fullName: "Ferdiansyah Annora", role: "iOS Developer", file: "ferdi", profile: "ferdiansyah-annora-0595a71ab" },
  { name: "Sendi", fullName: "Sendi Setiawan", role: "iOS Developer", file: "sendi", profile: "sendist" },
  { name: "Zaki", fullName: "Ahmad Zaki", role: "iOS Developer", file: "zaki", profile: "ahmadzzaki" },
  { name: "Fairuz", fullName: "Fairuz", role: "Product Designer", file: "fairuz", profile: "faairuzs" },
  { name: "Bryan", fullName: "Christian Bryan Seputra", role: "Product Designer", file: "bryan", profile: "christianbryans" },
];

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true" />;
}

export default function Home() {
  const liveWaitlist = Boolean(getMailerLiteConfig());
  const isPreview = !liveWaitlist && process.env.NODE_ENV === "development";

  return (
    <>
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <a className="nav-brand" href="#top" aria-label="Asterra home"><BrandMark /> Asterra</a>
          <div className="nav-links">
            <a className="team-nav" href="#team">Team</a>
            <a className="button button-outline" href="#waitlist">Get launch updates</a>
          </div>
        </nav>
      </header>

      <main id="top">
        <HeroScene
          introduction={
            <div className="section-heading intro" id="explore">
            <h2 id="explore-title">Turn the night sky<br /> into a treasure hunt.</h2>
            <p>Aim your iPhone at the sky, catch real stars, and watch your own Sky Garden take shape.</p>
          </div>
          }
          sky={<div className="hero-glows" />}
          stars={
            <Image src={`${assets}/star-field.webp`} width={2560} height={1707} alt="" sizes="120vw" preload className="hero-stars" />
          }
          horizon={
            <div className="hero-planet">
              <Image src={`${assets}/earth.webp`} width={1024} height={1024} alt="" sizes="110vw" preload className="hero-earth" />
            </div>
          }
          links={
            <div className="hero-links">
              <div className="socials">
                <a href={instagram}><Image src={`${assets}/instagram.svg`} width={20} height={20} alt="Instagram" /> asterra.app</a>
                <a href={tiktok}><Image src={`${assets}/tiktok.svg`} width={20} height={20} alt="TikTok" /> paraappleintelligence</a>
              </div>
              <a className="scroll-link" href="#explore" aria-label="Explore Asterra"><span /></a>
            </div>
          }
        >
          <h1 id="site-title"><BrandMark />Asterra</h1>
        </HeroScene>

        <section className="explore section-shell" aria-labelledby="explore-title">
          <PreviewScene>
            {previews.map(([title, description], index) => (
              <figure key={title}>
                <Image
                  className="preview-image"
                  src={`${assets}/preview-${index + 1}.jpg`}
                  alt={description}
                  width={474}
                  height={1024}
                  sizes="(max-width: 620px) 45vw, (max-width: 960px) 38vw, 280px"
                />
                <figcaption>{title}</figcaption>
              </figure>
            ))}
          </PreviewScene>
        </section>

        <section className="team" id="team" aria-labelledby="team-title">
          <div className="section-shell">
            <div className="section-heading">
              <h2 id="team-title">The people behind Asterra</h2>
            </div>
            <ul className="team-grid">
              {team.map((member) => (
                <li key={member.file}>
                  <a className="team-link" href={`https://www.linkedin.com/in/${member.profile}/`} aria-label={`${member.fullName}, ${member.role}, on LinkedIn`}>
                    <span className="portrait">
                      <Image src={`/team/${member.file}.png`} fill sizes="(max-width: 620px) 114px, 146px" alt="" />
                    </span>
                    <span className="team-name">{member.name}</span>
                    <span className="team-role">{member.role}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="waitlist" id="waitlist" aria-labelledby="waitlist-title">
          <div className="section-shell waitlist-inner">
            <BrandMark />
            <p className="review-status"><span /> In App Store review</p>
            <h2 id="waitlist-title">Get a launch reminder.</h2>
            {liveWaitlist || isPreview
              ? <WaitlistForm isPreview={isPreview} />
              : <p className="waitlist-note">Email signups will open soon. <a href={instagram}>Follow Asterra on Instagram</a> for launch news.</p>}
          </div>
        </section>
      </main>

      <footer className="footer section-shell">
        <a className="nav-brand" href="#top"><BrandMark /> Asterra</a>
        <div className="footer-links">
          <a href={instagram}>Instagram</a>
          <a href={tiktok}>TikTok</a>
        </div>
      </footer>
    </>
  );
}
