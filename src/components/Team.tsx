import { content } from "../content";
import type { SocialLinks } from "../content/types";
import "./Team.css";

const SOCIAL_ORDER: (keyof SocialLinks)[] = [
  "instagram",
  "facebook",
  "youtube",
  "linkedin",
  "tiktok",
];

const SOCIAL_LABEL: Record<keyof SocialLinks, string> = {
  instagram: "IG",
  facebook: "FB",
  youtube: "YT",
  linkedin: "in",
  tiktok: "TT",
};

export function Team() {
  const { team } = content;

  return (
    <section id="team" className="section team">
      <div className="section-head">
        <span className="eyebrow">{team.eyebrow}</span>
        <h2>{team.headline}</h2>
        <p>{team.body}</p>
      </div>

      <div className="team-grid">
        {team.members.map((member) => (
          <article className="team-card" key={member.id}>
            <img src={member.photo} alt="" className="team-photo" />
            <h3>{member.name}</h3>
            <span className="tag">{member.role}</span>
            <p>{member.bio}</p>
            <div className="team-socials">
              {SOCIAL_ORDER.filter((key) => member.socials[key]).map(
                (key) => (
                  <a
                    key={key}
                    href={member.socials[key]}
                    aria-label={`${member.name} on ${key}`}
                  >
                    {SOCIAL_LABEL[key]}
                  </a>
                )
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
