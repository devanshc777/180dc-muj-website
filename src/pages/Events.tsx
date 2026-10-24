import { CalendarDays, MapPin } from "lucide-react";
import { Hero, Heading, CTA } from "../components/UI";

type EventSession = { name: string; date: string };
type ChapterEvent = {
  title: string;
  type: string;
  date?: string;
  location: string;
  description: string;
  speaker?: string;
  sessions?: EventSession[];
  highlights: string[];
  links: string[];
};

const events: ChapterEvent[] = [
  {
    title: "ONEIROS 2025 – Speaker Sessions",
    type: "SPEAKER SESSIONS",
    location: "AB3, Vasanti Pai Auditorium, Manipal University Jaipur",
    description: "[Add the supplied ONEIROS 2025 event description.]",
    sessions: [
      { name: "Gajendra Purohit", date: "21 February 2025" },
      { name: "Rajat Sood", date: "22 February 2025" }
    ],
    highlights: ["[Add supplied key highlights for Gajendra Purohit’s session.]", "[Add supplied key highlights for Rajat Sood’s session.]"],
    links: ["Event poster: [Insert link]", "Photographs: [Insert link]", "Recap video: [Insert link]"]
  },
  {
    title: "Rephoria 1.0 – 180DC MUJ × VASSTR Case Competition",
    type: "CASE COMPETITION",
    date: "11 October 2025",
    location: "AB1-018, Manipal University Jaipur",
    description: "[Add the supplied 180DC MUJ × VASSTR collaboration description and brief, approved public event summary. Keep the public case description brief; do not include confidential case material.]",
    highlights: ["[Add supplied event highlights.]"],
    links: ["Event details: [Insert link]", "Photographs: [Insert link]"]
  },
  {
    title: "ONEIROS 2026 – Speaker Session",
    type: "SPEAKER SESSION",
    date: "15 March 2026",
    location: "[Add supplied venue]",
    description: "[Add supplied description for Varun Singla’s session.]",
    speaker: "Varun Singla — [Add official designation]",
    highlights: ["[Add supplied key highlights.]"],
    links: ["Event poster: [Insert link]", "Photographs: [Insert link]", "Recap video: [Insert link]"]
  },
  {
    title: "GMCC 2026",
    type: "CASE COMPETITION",
    date: "[Add supplied August 2026 dates]",
    location: "[Add venue]",
    description: "[Add supplied event description and brief, approved public case summary. Keep the public case description brief; do not include confidential case material.]",
    highlights: ["[Add supplied event highlights.]", "Stages: [Add supplied stage names and August 2026 dates.]"],
    links: ["Registration: [Insert link]", "Official case title: [Insert official case title]", "Case or event details: [Insert link]", "Event poster: [Insert link]"]
  }
];

export default function Events() {
  return <>
    <Hero num="05" kicker="EVENTS" title="Ideas into" accent="action." desc="Explore events hosted by 180 Degrees Consulting, Manipal University Jaipur—from skill-building sessions to conversations on social impact." />
    <section className="section events-section">
      <Heading kicker="EVENTS AT 180DC MUJ" title="Learn. Connect." accent="Create change." desc="A look at the experiences and opportunities our chapter brings to campus." />
      <div className="timeline-shell"><div className="timeline-track" aria-label="Events timeline">{[0, 1].map(copy => <div className="timeline-group" key={copy} aria-hidden={copy === 1}>{events.map((event, i) => <article className={`event-plaque plaque-${i % 4}`} key={`${copy}-${event.title}`}>
        <div className="plaque-art"><span>180DC MUJ / EVENT {String(i + 1).padStart(2, "0")}</span><b>{String(i + 1).padStart(2, "0")}</b></div>
        <label>{event.type}</label><h3>{event.title}</h3>
        {event.speaker && <p>{event.speaker}</p>}
        <p>{event.description}</p>
        {event.sessions?.map(session => <div className="event-meta" key={session.name}><span><CalendarDays size={14} />{session.date}</span><span>{session.name}</span></div>)}
        {event.date && <div className="event-meta"><span><CalendarDays size={14} />{event.date}</span><span><MapPin size={14} />{event.location}</span></div>}
        {event.sessions && <div className="event-meta"><span><MapPin size={14} />{event.location}</span></div>}
        <div className="event-meta"><strong>HIGHLIGHTS</strong>{event.highlights.map(highlight => <span key={highlight}>{highlight}</span>)}</div>
        <div className="event-meta"><strong>EVENT LINKS</strong>{event.links.map(link => <span key={link}>{link}</span>)}</div>
      </article>)}</div>)}</div></div>
      <p className="timeline-hint">Events move across the timeline · Hover or focus to pause</p>
      <div className="notice">Bracketed items are details or links to confirm before publication.</div>
    </section>
    <section className="section dark"><Heading kicker="HOST AN EVENT WITH US" title="Have an idea" accent="for campus?" desc="Partner with 180DC MUJ to create a workshop, challenge or conversation for the student community." /><CTA>Get in touch</CTA></section>
  </>;
}
