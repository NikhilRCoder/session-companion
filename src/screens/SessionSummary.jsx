import { useState } from "react";
import { theme, fontDisplay, fontSans } from "../theme.js";
import { getPeople, getFields } from "../storage.js";
import { formatDuration, formatDate } from "../format.js";
import { formatCoords, totalDistance, formatDistance } from "../geo.js";
import { INTENTIONS, METHODS, ENVIRONMENTS, SCALE, REPEAT } from "../wizardSteps.js";
import { TrackSketch } from "../components/TrackSketch.jsx";
import {
  Screen,
  Slab,
  SlabHead,
  Ring,
  Body,
  Foot,
  SectionRule,
  Wrap,
  Chip,
  Card,
  StatRow,
  StatsGrid,
  StatBox,
  Tag,
  TextArea,
  Input,
  Cta,
} from "../components/primitives.jsx";
import { CheckIcon } from "../components/icons.jsx";

function MapLink({ point, children }) {
  return (
    <a href={`https://maps.google.com/?q=${point.lat},${point.lng}`} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
      {children}
    </a>
  );
}

function EditField({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <SectionRule ink>{label}</SectionRule>
      {children}
    </div>
  );
}

export function SessionSummary({ session, justFinished, onBack, onDone, onEdit, onDelete }) {
  const people = getPeople();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [draft, setDraft] = useState(session);
  const duration = session.endTime ? formatDuration(new Date(session.endTime) - new Date(session.startTime)) : "—";
  const peopleNames = (session.peopleIds || []).map((id) => people.find((p) => p.id === id)?.name).filter(Boolean);
  const checkinCount = session.checkins?.length || 0;

  if (isEditing) {
    return (
      <Screen noBottomPad>
        <Slab>
          <SlabHead kicker="Editing" onBack={() => setIsEditing(false)} />
          <h2 style={{ fontFamily: fontDisplay, fontSize: 30, fontWeight: 700, textTransform: "uppercase", marginTop: 16, position: "relative" }}>
            Edit session
          </h2>
        </Slab>
        <Body>
          <EditField label="Intention">
            <Wrap>
              {INTENTIONS.map((opt) => (
                <Chip key={opt} label={opt} size="sm" selected={draft.intention === opt} onTap={() => setDraft({ ...draft, intention: opt })} />
              ))}
            </Wrap>
          </EditField>
          <EditField label="Method">
            <Wrap>
              {METHODS.map((opt) => (
                <Chip key={opt} label={opt} size="sm" selected={(draft.method || draft.format) === opt} onTap={() => setDraft({ ...draft, method: opt })} />
              ))}
            </Wrap>
          </EditField>
          <EditField label="Environment">
            <Wrap>
              {ENVIRONMENTS.map((opt) => (
                <Chip key={opt} label={opt} size="sm" selected={(draft.environment || draft.setting) === opt} onTap={() => setDraft({ ...draft, environment: opt })} />
              ))}
            </Wrap>
          </EditField>
          <EditField label="Place">
            <Input value={draft.place || ""} onChange={(e) => setDraft({ ...draft, place: e.target.value })} placeholder="Type a place name..." />
          </EditField>
          <EditField label="Amount spent">
            <Input
              value={typeof draft.cost === "number" ? String(draft.cost) : ""}
              onChange={(e) => setDraft({ ...draft, cost: e.target.value.trim() === "" ? undefined : Number(e.target.value) })}
              placeholder="Amount spent (optional)"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
            />
          </EditField>
          <EditField label="Overall rating">
            <div style={{ display: "flex", gap: 6 }}>
              {SCALE.map((opt) => (
                <Chip key={opt} label={opt} size="sm" grow selected={draft.rating === opt} onTap={() => setDraft({ ...draft, rating: opt })} />
              ))}
            </div>
          </EditField>
          <EditField label="Would repeat">
            <div style={{ display: "flex", gap: 6 }}>
              {REPEAT.map((opt) => (
                <Chip key={opt} label={opt} size="sm" grow selected={draft.repeat === opt} onTap={() => setDraft({ ...draft, repeat: opt })} />
              ))}
            </div>
          </EditField>
          <EditField label="Notes">
            <TextArea value={draft.notes || ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} rows={3} />
          </EditField>
          <EditField label="Comedown">
            <TextArea value={draft.comedownNotes || ""} onChange={(e) => setDraft({ ...draft, comedownNotes: e.target.value })} rows={3} />
          </EditField>
          <EditField label="Reflection">
            <TextArea value={draft.reflection || ""} onChange={(e) => setDraft({ ...draft, reflection: e.target.value })} rows={3} />
          </EditField>
          {Object.entries(draft.custom || {}).map(([fieldId, entry]) => {
            if (!entry?.label) return null;
            const setValue = (value) => setDraft({ ...draft, custom: { ...draft.custom, [fieldId]: { ...entry, value } } });
            const liveOptions = entry.type === "yesno" ? ["Yes", "No"] : entry.type === "choice" ? getFields().find((f) => f.id === fieldId)?.options : null;
            return (
              <EditField key={fieldId} label={entry.label}>
                {liveOptions ? (
                  <Wrap>
                    {liveOptions.map((opt) => (
                      <Chip key={opt} label={opt} size="sm" selected={entry.value === opt} onTap={() => setValue(opt)} />
                    ))}
                  </Wrap>
                ) : entry.type === "number" ? (
                  <Input value={typeof entry.value === "number" ? String(entry.value) : ""} onChange={(e) => setValue(e.target.value.trim() === "" ? undefined : Number(e.target.value))} type="number" inputMode="decimal" step="0.01" />
                ) : (
                  <TextArea value={entry.value || ""} onChange={(e) => setValue(e.target.value)} rows={3} />
                )}
              </EditField>
            );
          })}
        </Body>
        <Foot style={{ display: "flex", gap: 10 }}>
          <Cta tone="ghost" onTap={() => { setDraft(session); setIsEditing(false); }} style={{ flex: 1, justifyContent: "center" }}>
            <span>Cancel</span>
          </Cta>
          <Cta onTap={() => { onEdit(draft); setIsEditing(false); }} style={{ flex: 1, justifyContent: "center" }}>
            <span>Save</span>
          </Cta>
        </Foot>
      </Screen>
    );
  }

  return (
    <Screen noBottomPad>
      {justFinished ? (
        <Slab accent style={{ padding: "24px 20px 28px" }}>
          <Ring style={{ right: -40, top: -40, width: 180, height: 180, color: theme.surface }} />
          <div style={{ position: "relative", fontFamily: fontDisplay, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.85 }}>
            Logged
          </div>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 42, fontWeight: 700, textTransform: "uppercase", lineHeight: 0.95, marginTop: 10, position: "relative" }}>
            Session
            <br />
            complete
          </h2>
          <div style={{ position: "relative", marginTop: 14, fontFamily: fontDisplay, fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {duration} — {checkinCount} check-in{checkinCount === 1 ? "" : "s"}
          </div>
        </Slab>
      ) : (
        <Slab>
          <Ring style={{ top: -50, right: -30, width: 170, height: 170, color: theme.accent, opacity: 0.45 }} />
          <SlabHead kicker={`${formatDate(session.startTime)} — ${duration}`} onBack={onBack} />
          <h2 style={{ fontFamily: fontDisplay, fontSize: 34, fontWeight: 700, textTransform: "uppercase", lineHeight: 1, marginTop: 18, position: "relative" }}>
            {session.intention || session.format || "Session"}
            <br />
            <span style={{ color: theme.accent }}>/</span> {session.method || session.setting || "—"}
          </h2>
        </Slab>
      )}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
        <StatsGrid style={{ marginBottom: 18 }}>
          <StatBox label="Rating" value={session.rating ? `${session.rating}/5` : "—"} />
          <StatBox label="Met intention" value={session.metIntention || "—"} />
          <StatBox label="Strain" value={session.strain || "—"} />
          <StatBox label="Would repeat" value={session.repeat || "—"} />
        </StatsGrid>
        {(session.effects?.length || session.sideEffects?.length) ? (
          <div style={{ marginBottom: 18 }}>
            <SectionRule ink>Marked</SectionRule>
            <Wrap>
              {(session.effects || []).map((t) => (
                <Tag key={`e-${t}`}>{t}</Tag>
              ))}
              {(session.sideEffects || []).map((t) => (
                <Tag key={`s-${t}`} outlined>
                  {t}
                </Tag>
              ))}
            </Wrap>
          </div>
        ) : null}
        <Card>
          <StatRow label="Date" value={formatDate(session.startTime)} />
          <StatRow label="Duration" value={duration} />
          {typeof session.breakDays === "number" && (
            <StatRow label="Ended Break" value={`${session.breakDays} day${session.breakDays === 1 ? "" : "s"}`} />
          )}
          {session.dose && <StatRow label="Dose" value={`${session.dose} ${session.doseUnit || "mg"}`} />}
          {(session.environment || session.setting) && <StatRow label="Environment" value={session.environment || session.setting} />}
          {session.tolerance && <StatRow label="Tolerance" value={session.tolerance} />}
          {session.baselineMood && <StatRow label="Baseline Mood" value={`${session.baselineMood}/5`} />}
          {session.place && <StatRow label="Place" value={session.place} />}
          {session.location && !(session.track?.length >= 2) && (
            <StatRow label="Location" value={<MapLink point={session.location}>{formatCoords(session.location)} ↗</MapLink>} />
          )}
          {typeof session.cost === "number" && <StatRow label="Amount Spent" value={`$${session.cost.toFixed(2)}`} />}
        </Card>
        {session.track?.length >= 2 && (
          <Card>
            <SectionRule ink>Movement</SectionRule>
            <div style={{ marginTop: 10 }}>
              <TrackSketch track={session.track} />
              <StatRow label="Distance Moved" value={formatDistance(totalDistance(session.track))} />
              <StatRow label="Track Points" value={session.track.length} />
              <StatRow label="Start" value={<MapLink point={session.track[0]}>{formatCoords(session.track[0])} ↗</MapLink>} />
              <StatRow label="End" value={<MapLink point={session.track[session.track.length - 1]}>{formatCoords(session.track[session.track.length - 1])} ↗</MapLink>} />
            </div>
          </Card>
        )}
        {session.checkins?.length > 0 && (
          <Card>
            <SectionRule ink>Check-in Log</SectionRule>
            <div style={{ marginTop: 8 }}>
              {session.checkins.map((c, i) => (
                <StatRow key={i} label={`${c.time} — ${c.symptoms?.length ? c.symptoms.join(", ") : "No symptoms"}`} value={`${c.intensity}/10`} />
              ))}
            </div>
          </Card>
        )}
        {(session.moodsPre?.length || session.moodsPost?.length) ? (
          <Card>
            <SectionRule ink>Mood Shift</SectionRule>
            {session.moodsPre?.length > 0 && (
              <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 14, marginTop: 8 }}>Before — {session.moodsPre.join(", ")}</p>
            )}
            {session.moodsPost?.length > 0 && (
              <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 14, marginTop: 6 }}>After — {session.moodsPost.join(", ")}</p>
            )}
          </Card>
        ) : null}
        {peopleNames.length > 0 && (
          <Card>
            <SectionRule ink>People</SectionRule>
            {peopleNames.map((name) => (
              <StatRow key={name} label={name} value={session.interactionQuality?.[(people.find((p) => p.name === name) || {}).id] || "—"} />
            ))}
          </Card>
        )}
        {session.notes && (
          <Card>
            <SectionRule ink>Notes</SectionRule>
            <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>{session.notes}</p>
          </Card>
        )}
        {session.comedownNotes && (
          <Card>
            <SectionRule ink>Comedown</SectionRule>
            <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>{session.comedownNotes}</p>
          </Card>
        )}
        {session.reflection && (
          <Card>
            <SectionRule ink>Reflection</SectionRule>
            <p style={{ fontFamily: fontSans, color: theme.n600, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>{session.reflection}</p>
          </Card>
        )}
        {session.custom && Object.keys(session.custom).length > 0 && (
          <Card>
            <SectionRule ink>Custom</SectionRule>
            <div style={{ marginTop: 4 }}>
              {Object.entries(session.custom).map(([fieldId, entry]) => {
                if (!entry?.label) return null;
                return entry.type === "text" ? (
                  <p key={fieldId} style={{ fontFamily: fontSans, color: theme.n600, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
                    {entry.label} — {String(entry.value)}
                  </p>
                ) : (
                  <StatRow key={fieldId} label={entry.label} value={String(entry.value)} />
                );
              })}
            </div>
          </Card>
        )}
        {(onEdit || onDelete) && (
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 4, marginBottom: 16 }}>
            {onEdit && (
              <button onClick={() => setIsEditing(true)} style={{ background: "none", border: "none", color: theme.n600, cursor: "pointer", fontSize: 13, fontFamily: fontSans }}>
                Edit
              </button>
            )}
            {onDelete && !confirmingDelete && (
              <button onClick={() => setConfirmingDelete(true)} style={{ background: "none", border: "none", color: theme.accent700, cursor: "pointer", fontSize: 13, fontFamily: fontSans }}>
                Delete Session
              </button>
            )}
          </div>
        )}
      </div>
      <Foot>
        {confirmingDelete ? (
          <div style={{ display: "flex", gap: 10 }}>
            <Cta tone="ghost" onTap={() => setConfirmingDelete(false)} style={{ flex: 1, justifyContent: "center" }}>
              <span>Cancel</span>
            </Cta>
            <Cta tone="danger" onTap={onDelete} style={{ flex: 1, justifyContent: "center" }}>
              <span>Confirm Delete</span>
            </Cta>
          </div>
        ) : justFinished ? (
          <Cta onTap={onDone}>
            <span>Back to home</span>
            <CheckIcon />
          </Cta>
        ) : (
          <Cta onTap={onDone}>
            <span>Done</span>
          </Cta>
        )}
      </Foot>
    </Screen>
  );
}
