"use client";

import { Check, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CLUBS, CLUB_EVENTS } from "@/lib/vespa-social";
import { useGarage } from "@/lib/store";

export function ClubsDirectory() {
  const { joinedClubs, toggleClub } = useGarage();

  return (
    <div>
      <section aria-labelledby="clubs-list">
        <h2 id="clubs-list" className="font-display mt-8 text-xl">
          Clubs ({CLUBS.length})
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Verified organisations only — counts and dates are shown solely
          where confirmed. Join buttons are demo bookmarks stored in this
          browser, not real memberships.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CLUBS.map((c) => {
            const joined = joinedClubs.includes(c.name);
            return (
              <Card key={c.name} className={joined ? "border-lagoon" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center bg-racing text-white">
                      <Flag className="size-4" />
                    </span>
                    {c.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary">{c.where}</Badge>
                    <Badge variant="outline">{c.members}</Badge>
                    {joined && (
                      <Badge className="bg-lagoon text-white">Member</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-600">{c.blurb}</p>
                  <p className="mt-2 text-sm font-medium">{c.ride}</p>
                  <Button
                    size="sm"
                    variant={joined ? "secondary" : "default"}
                    className="mt-3"
                    onClick={() => toggleClub(c.name)}
                    aria-pressed={joined}
                  >
                    {joined && <Check className="size-4" />}
                    {joined ? "Joined — leave" : "Join club"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="mt-4 max-w-2xl border border-dashed border-line bg-white px-4 py-3 text-sm text-zinc-600">
          The directory is growing: local clubs join once their details are
          verified against official sources. No invented contacts, dates, or
          member counts.
        </p>
      </section>

      <section aria-labelledby="club-calendar" className="mt-10">
        <h2 id="club-calendar" className="font-display text-xl">
          Calendar
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Announced dates only — always verify with the organiser before
          travelling.
        </p>
        <ul className="mt-4 space-y-2">
          {CLUB_EVENTS.map((e) => (
            <li
              key={e.name}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 border border-line bg-white px-4 py-3 text-sm"
            >
              <span className="font-grotesk font-bold">{e.name}</span>
              <Badge variant={e.status === "upcoming" ? "default" : "secondary"}>
                {e.status === "upcoming" ? "Upcoming" : "Held"}
              </Badge>
              <Badge variant="outline">{e.region}</Badge>
              <span className="w-full text-zinc-600 sm:w-auto">
                {e.date} · {e.place} · {e.org}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
