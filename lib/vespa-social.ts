/**
 * Club directory + event calendar seeds. Verified organisations and
 * announced dates only — anything unconfirmed is stated as such.
 */

export type Club = {
  name: string;
  where: string;
  members: string;
  blurb: string;
  ride: string;
};

export const CLUBS: Club[] = [
  {
    name: "Vespa World Club",
    where: "Worldwide",
    members: "66 national clubs",
    blurb:
      "The international umbrella body — runs Vespa World Days, the annual global rally.",
    ride: "Next: Vespa World Days 2027 · Durrës, Albania, May 13–16",
  },
  {
    name: "Vespa Club of America",
    where: "United States",
    members: "National club",
    blurb:
      "Hosts Amerivespa each year — the big US meet with gymkhana and long-distance riders.",
    ride: "Next: see the official site for dates",
  },
  {
    name: "Vespa Club of Chicago",
    where: "Chicago, USA",
    members: "VCOA chapter",
    blurb:
      "VCOA's Chicago chapter — hosted the national Amerivespa rally in 2026.",
    ride: "Hosted: Amerivespa 2026 · Chicago, Sept 2–6",
  },
  {
    name: "Vespa Club of Britain",
    where: "United Kingdom",
    members: "National club",
    blurb:
      "National club for the UK since 15 May 1952, with rallies and ride-outs.",
    ride: "Next: see the official site for dates",
  },
  {
    name: "Vespa Club Italia",
    where: "Italy",
    members: "National club",
    blurb: "Italy's national club — celebrated seventy years in 2019.",
    ride: "Next: see the official site for dates",
  },
];

export type ClubEvent = {
  name: string;
  date: string;
  place: string;
  region: "Europe" | "North America";
  org: string;
  status: "upcoming" | "held";
};

export const CLUB_EVENTS: ClubEvent[] = [
  {
    name: "Vespa World Days 2027",
    date: "May 13–16, 2027",
    place: "Durrës, Albania",
    region: "Europe",
    org: "Vespa World Club",
    status: "upcoming",
  },
  {
    name: "Amerivespa 2026",
    date: "Sept 2–6, 2026",
    place: "Chicago, USA",
    region: "North America",
    org: "VCOA + Vespa Club of Chicago",
    status: "held",
  },
  {
    name: "Slaughterhouse 32",
    date: "Sept 2026 · Labour Day weekend",
    place: "Chicago, USA",
    region: "North America",
    org: "Alongside Amerivespa",
    status: "held",
  },
];
