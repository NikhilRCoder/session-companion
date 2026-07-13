import { useState } from "react";
import { theme, fontSerif, fontSans } from "../theme.js";
import { getPeople } from "../storage.js";
import { formatDuration, formatDate } from "../format.js";
import { formatCoords } from "../geo.js";
import { PRE_STEPS, POST_STEPS } from "../wizardSteps.js";
import { Screen, Eyebrow, Card, StatRow, TextArea, PrimaryButton } from "../components/primitives.jsx";

const optionsFor = (key) => (PRE_STEPS.find((s) => s.key === key) || POST_STEPS.find((s) => s.key === key))?.options || [];

function EditChip({ label, selected, onTap }) {
  return (
    <button
      onClick={onTap}
      style={{
        padding: "9px 14px",
        borderRadius: 999,
        fontFamily: fontSans,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        border: selected ? `1.5px solid ${theme.rose}` : `1.5px solid ${theme.line}`,
        background: selected ? `${theme.rose}1a` : "transparent",
        color: selected ? theme.rose : theme.fade,
      }}
    >
      {label}
    </button>
  );
}

function EditField({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Eyebrow>{label}</Eyebrow>
      {children}
    </div>
  );
}

export function SessionSummary({ session, onDone, onEdit, onDelete }) {
  const people = getPeople();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [draft, setDraft] = useState(session);
  const duration = session.endTime
    ? formatDuration(new Date(session.endTime) - new Date(session.startTime))
    : "—";
  const peopleNames = (session.peopleIds || []).map((id) => people.find((p) => p.id === id)?.name).filter(Boolean);

  if (isEditing) {
    return (
      <Screen>
        <div style={{ paddingTop: 18, marginBottom: 24 }}>
          <Eyebrow>Editing</Eyebrow>
          <h2 style={{ fontFamily: fontSerif, fontSize: 27, fontWeight: 600, color: theme.bone }}>Edit Session</h2>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <EditField label="Format">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {optionsFor("format").map((opt) => (
                <EditChip key={opt} label={opt} selected={draft.format === opt} onTap={() => setDraft({ ...draft, format: opt })} />
              ))}
            </div>
          </EditField>
          <EditField label="Setting">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {optionsFor("setting").map((opt) => (
                <EditChip key={opt} label={opt} selected={draft.setting === opt} onTap={() => setDraft({ ...draft, setting: opt })} />
              ))}
            </div>
          </EditField>
          <EditField label="Place">
            <input
              value={draft.place || ""}
              onChange={(e) => setDraft({ ...draft, place: e.target.value })}
              placeholder="Type a place name..."
              style={{
                width: "100%",
                background: theme.bgCard,
                border: `1.5px solid ${theme.line}`,
                borderRadius: 14,
                padding: "13px 16px",
                color: theme.bone,
                fontSize: 15,
                fontFamily: fontSans,
                boxSizing: "border-box",
              }}
            />
          </EditField>
          <EditField label="Amount Spent">
            <input
              value={typeof draft.cost === "number" ? String(draft.cost) : ""}
              onChange={(e) =>
                setDraft({ ...draft, cost: e.target.value.trim() === "" ? undefined : Number(e.target.value) })
              }
              placeholder="Amount spent (optional)"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              style={{
                width: "100%",
                background: theme.bgCard,
                border: `1.5px solid ${theme.line}`,
                borderRadius: 14,
                padding: "13px 16px",
                color: theme.bone,
                fontSize: 15,
                fontFamily: fontSans,
                boxSizing: "border-box",
              }}
            />
          </EditField>
          <EditField label="Intensity">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {optionsFor("intensity").map((opt) => (
                <EditChip key={opt} label={opt} selected={draft.intensity === opt} onTap={() => setDraft({ ...draft, intensity: opt })} />
              ))}
            </div>
          </EditField>
          <EditField label="Paranoia">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {optionsFor("paranoia").map((opt) => (
                <EditChip key={opt} label={opt} selected={draft.paranoia === opt} onTap={() => setDraft({ ...draft, paranoia: opt })} />
              ))}
            </div>
          </EditField>
          <EditField label="Intention">
            <TextArea value={draft.intention || ""} onChange={(e) => setDraft({ ...draft, intention: e.target.value })} rows={3} />
          </EditField>
          <EditField label="Notes">
            <TextArea value={draft.notes || ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} rows={3} />
          </EditField>
          <EditField label="Reflection">
            <TextArea value={draft.reflection || ""} onChange={(e) => setDraft({ ...draft, reflection: e.target.value })} rows={3} />
          </EditField>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <PrimaryButton
            tone="ghost"
            onTap={() => {
              setDraft(session);
              setIsEditing(false);
            }}
            style={{ flex: 1 }}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            tone="sage"
            onTap={() => {
              onEdit(draft);
              setIsEditing(false);
            }}
            style={{ flex: 1 }}
          >
            Save Changes
          </PrimaryButton>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div style={{ paddingTop: 18, marginBottom: 24, textAlign: "center" }}>
        <span style={{ fontSize: 32, display: "block", marginBottom: 10 }}>🌿</span>
        <Eyebrow>Logged</Eyebrow>
        <h2 style={{ fontFamily: fontSerif, fontSize: 27, fontWeight: 600, color: theme.bone }}>That's a wrap.</h2>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Card>
          <StatRow label="Date" value={formatDate(session.startTime)} />
          <StatRow label="Duration" value={duration} />
          {session.format && <StatRow label="Format" value={session.format} />}
          {session.setting && <StatRow label="Setting" value={session.setting} />}
          {session.place && <StatRow label="Place" value={session.place} />}
          {session.location && (
            <StatRow
              label="Location"
              value={
                <a
                  href={`https://maps.google.com/?q=${session.location.lat},${session.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline", textDecorationColor: theme.line }}
                >
                  {formatCoords(session.location)} ↗
                </a>
              }
            />
          )}
          {typeof session.cost === "number" && <StatRow label="Amount Spent" value={`$${session.cost.toFixed(2)}`} />}
        </Card>
        {(session.moodsPre?.length || session.moodsPost?.length) ? (
          <Card>
            <Eyebrow>Mood Shift</Eyebrow>
            {session.moodsPre?.length > 0 && (
              <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 14, marginTop: 8 }}>
                Before — <span style={{ color: theme.bone }}>{session.moodsPre.join(", ")}</span>
              </p>
            )}
            {session.moodsPost?.length > 0 && (
              <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 14, marginTop: 6 }}>
                After — <span style={{ color: theme.sage }}>{session.moodsPost.join(", ")}</span>
              </p>
            )}
          </Card>
        ) : null}
        {session.intensity && (
          <Card>
            <StatRow label="Intensity" value={session.intensity} />
            <StatRow label="Paranoia" value={session.paranoia} />
          </Card>
        )}
        {peopleNames.length > 0 && (
          <Card>
            <Eyebrow tone="rose">People</Eyebrow>
            {peopleNames.map((name) => (
              <StatRow
                key={name}
                label={name}
                value={session.interactionQuality?.[(people.find((p) => p.name === name) || {}).id] || "—"}
              />
            ))}
          </Card>
        )}
        {session.intention && (
          <Card>
            <Eyebrow>Intention</Eyebrow>
            <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
              {session.intention}
            </p>
          </Card>
        )}
        {session.notes && (
          <Card>
            <Eyebrow>Notes</Eyebrow>
            <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
              {session.notes}
            </p>
          </Card>
        )}
        {session.reflection && (
          <Card>
            <Eyebrow>Reflection</Eyebrow>
            <p style={{ fontFamily: fontSans, color: theme.fade, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
              {session.reflection}
            </p>
          </Card>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 4, marginBottom: 8 }}>
          {onEdit && (
            <button
              onClick={() => setIsEditing(true)}
              style={{ background: "none", border: "none", color: theme.faint, cursor: "pointer", fontSize: 13 }}
            >
              Edit
            </button>
          )}
          {onDelete && !confirmingDelete && (
            <button
              onClick={() => setConfirmingDelete(true)}
              style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", fontSize: 13 }}
            >
              Delete Session
            </button>
          )}
        </div>
      )}
      <div style={{ marginTop: 12 }}>
        {confirmingDelete ? (
          <div style={{ display: "flex", gap: 10 }}>
            <PrimaryButton tone="ghost" onTap={() => setConfirmingDelete(false)} style={{ flex: 1 }}>
              Cancel
            </PrimaryButton>
            <PrimaryButton tone="danger" onTap={onDelete} style={{ flex: 1, borderColor: theme.danger }}>
              Confirm Delete
            </PrimaryButton>
          </div>
        ) : (
          <PrimaryButton tone="sage" onTap={onDone}>
            Done
          </PrimaryButton>
        )}
      </div>
    </Screen>
  );
}
