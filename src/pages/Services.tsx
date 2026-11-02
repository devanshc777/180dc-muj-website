
import {
  ArrowUpRight,
  TrendingUp,
  Search,
  Megaphone,
  Settings2,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { services } from "../data";
import {
  Hero,
  Heading,
  CTA,
  TextLink,
} from "../components/UI";

const icons = [TrendingUp, Search, Megaphone, Settings2];

export function ServicesIndex() {
  return (
    <>
      <Hero
        num="02"
        kicker="SERVICES"
        title="Good intentions."
        accent="Stronger execution."
        desc="Flexible consulting support for non-profits, social enterprises and organisations working toward meaningful change."
      />

      <section className="section">
        <Heading
          kicker="OUR CAPABILITIES"
          title="Four ways to"
          accent="move forward."
          desc="Explore the kinds of questions we can help organisations investigate, and the outputs a project may produce. Final scope is agreed with each partner."
        />

        <div className="cards two">
          {services.map((s, i) => {
            const Icon = icons[i % icons.length];

            return (
              <Link
                className="card service"
                to={`/services/${s.slug}`}
                key={s.slug}
              >
                <label>{s.n} / CAPABILITY</label>
                <Icon className="greenicon" />
                <h3>{s.title}</h3>
                <p>{s.short}</p>
                <span className="cardlink">
                  Explore capability <ArrowUpRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section dark">
        <Heading
          kicker="HOW WE WORK"
          title="Structured process."
          accent="Human outcomes."
        />

        <div className="cards four">
          {[
            [
              "01",
              "Listen & define",
              "Align on goals, context and the core problem.",
            ],
            [
              "02",
              "Research & diagnose",
              "Gather evidence, test assumptions and find root causes.",
            ],
            [
              "03",
              "Develop options",
              "Build practical, evidence-backed recommendations.",
            ],
            [
              "04",
              "Deliver & enable",
              "Provide outputs, next steps and ways to track progress.",
            ],
          ].map(([number, title, description]) => (
            <article className="card" key={number}>
              <label>{number}</label>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section closing">
        <Heading
          kicker="HAVE A CHALLENGE?"
          title="Let's work out"
          accent="the right question."
        />
        <CTA>Discuss a project</CTA>
      </section>
    </>
  );
}

export function ServiceDetail() {
  const { slug = "" } = useParams();
  const s = services.find((service) => service.slug === slug);

  if (!s) {
    return (
      <section className="section">
        <h1>Service not found</h1>
        <TextLink to="/services">Back to services</TextLink>
      </section>
    );
  }

  return (
    <>
      <Hero
        num={s.n}
        kicker={s.title.toUpperCase()}
        title={s.title}
        accent="with purpose."
        desc={s.description}
      />

      <section className="section split">
        <div>
          <Heading
            kicker="WHAT WE HELP WITH"
            title="Questions worth"
            accent="solving."
          />
        </div>

        <div className="rows">
          {s.capabilities.map((capability, i) => (
            <div key={capability}>
              <label>
                {String(i + 1).padStart(2, "0")}
              </label>
              {capability}
            </div>
          ))}
        </div>
      </section>

      <section className="section dark">
        <Heading
          kicker="POTENTIAL OUTPUTS"
          title="From insight"
          accent="to action."
        />

        <div className="cards two">
          {s.deliverables.map((deliverable, i) => (
            <article className="card" key={deliverable}>
              <label>
                DELIVERABLE / {String(i + 1).padStart(2, "0")}
              </label>
              <h3>{deliverable}</h3>
              <p>
                Scope and format should be tailored to the client brief
                and intended use.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <Heading
          kicker="PROJECT LIBRARY"
          title="The work behind"
          accent="the words."
          desc="Selected project summaries are available where chapter notes describe relevant work. Detailed deliverables and outcomes require client approval."
        />

        <div className="cards two">
          <Link
            className="card case"
            to={`/case-studies/${s.slug}-case-01`}
          >
            <div className="casecover">{s.n} / CASE FILE</div>
            <label>ILLUSTRATIVE CASE FILE</label>
            <h3>{s.title} engagement</h3>
            <p>
              Explore the case-study framework for documenting a challenge, research approach, recommendations and evidence of outcomes.
            </p>
            <span className="cardlink">
              Open case study <ArrowUpRight size={16} />
            </span>
          </Link>


        </div>

        <div className="notice">
          Project work is published only when scope and client permissions are confirmed. Recommendations, deliverables and measured outcomes are described separately.
        </div>
      </section>

      <section className="section closing">
        <Heading
          kicker="NEXT STEP"
          title="Have a challenge"
          accent="in this area?"
        />
        <CTA>Start a conversation</CTA>
      </section>
    </>
  );
}
