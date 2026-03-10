import { useState } from "react";

const menu = {
  Shareables: {
    sub: "$–$$$",
    items: [
      {
        id: "s1",
        name: "Group Workout Class",
        desc: "Dance class, instructor-led group lift, other group fitness class",
        cost: 10,
      },
      {
        id: "s2",
        name: "Group Sports",
        desc: "Pickleball, volleyball, hiking, walk at the park, other",
        cost: 10,
      },
      {
        id: "s3",
        name: "Outdoor Activities",
        desc: "Trail running, kayaking, cycling outdoors, nature hike",
        cost: 10,
      },
      { id: "s4", name: "Other", desc: "", cost: 10, isOther: true },
    ],
  },
  "Small Plates": {
    sub: "$",
    items: [
      {
        id: "sp1",
        name: "Light Cardio",
        desc: "Gentle walk, recreational dancing, casual bike ride",
        cost: 8,
      },
      {
        id: "sp2",
        name: "Gentle Movement",
        desc: "Full-body stretch, yoga flow, mobility work, foam rolling",
        cost: 8,
      },
      { id: "sp3", name: "Other", desc: "", cost: 8, isOther: true },
    ],
  },
  "House Specials": {
    sub: "$$",
    items: [
      {
        id: "hs1",
        name: "Moderate Cardio",
        desc: "Jog/run, mid/high-tempo incline walk, swimming, cycling",
        cost: 10,
      },
      {
        id: "hs2",
        name: "Strength Training",
        desc: "Legs and/or glutes day, upper body day, ab circuit, other",
        cost: 10,
      },
      { id: "hs3", name: "Other", desc: "", cost: 10, isOther: true },
    ],
  },
  "Power Plates": {
    sub: "$$$",
    items: [
      {
        id: "pp1",
        name: "Intense Cardio",
        desc: "HIIT, sprint intervals, cycling, long-distance run",
        cost: 12,
      },
      {
        id: "pp2",
        name: "Heavy Lifting",
        desc: "Heavy: legs and/or glutes day, upper body day, other",
        cost: 12,
      },
      { id: "pp3", name: "Other", desc: "", cost: 12, isOther: true },
    ],
  },
  "Snacks & Sides": {
    sub: "¢",
    items: [
      { id: "ss1", name: "Stretch Break", desc: "", cost: 2 },
      { id: "ss2", name: "Breathwork", desc: "", cost: 2 },
      { id: "ss3", name: "5–10 Min Walk", desc: "", cost: 4 },
      { id: "ss4", name: "Dance Break", desc: "", cost: 4 },
      { id: "ss5", name: "Other", desc: "", cost: 4, isOther: true },
    ],
  },
  "Self-Care Specials": {
    sub: "On the House",
    items: [
      { id: "sc1", name: "Rest & Recovery Day", desc: "", cost: 0 },
      { id: "sc2", name: "Massage", desc: "", cost: 0 },
      { id: "sc3", name: "Meditation", desc: "", cost: 0 },
      { id: "sc4", name: "Other", desc: "", cost: 0, isOther: true },
    ],
  },
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const ENERGY = ["¢", "$", "$$", "$$$"];

const emptyDay = () => ({ energy: "$", items: [] });

export default function App() {
  const [tab, setTab] = useState("menu");
  const [plan, setPlan] = useState(() =>
    Object.fromEntries(DAYS.map((d) => [d, emptyDay()]))
  );
  const [modal, setModal] = useState(null);
  const [otherInputs, setOtherInputs] = useState({});

  const toggleItem = (day, item, customLabel) => {
    setPlan((p) => {
      const existing = p[day].items;
      const alreadyIn = existing.find((i) => i.id === item.id);
      const newItems = alreadyIn
        ? existing.filter((i) => i.id !== item.id)
        : [
            ...existing,
            {
              id: item.id,
              name: item.isOther ? customLabel || "Other" : item.name,
              cost: item.cost,
            },
          ];
      return { ...p, [day]: { ...p[day], items: newItems } };
    });
  };

  const isSelected = (day, itemId) =>
    plan[day].items.some((i) => i.id === itemId);
  const dayTotal = (day) => plan[day].items.reduce((s, i) => s + i.cost, 0);
  const weekTotal = DAYS.reduce((s, d) => s + dayTotal(d), 0);

  const secTotals = Object.entries(menu)
    .map(([sec, data]) => ({
      sec,
      count: DAYS.reduce(
        (s, d) =>
          s +
          plan[d].items.filter((i) => data.items.some((mi) => mi.id === i.id))
            .length,
        0
      ),
      cost: DAYS.reduce(
        (s, d) =>
          s +
          plan[d].items
            .filter((i) => data.items.some((mi) => mi.id === i.id))
            .reduce((ss, i) => ss + i.cost, 0),
        0
      ),
    }))
    .filter((s) => s.count > 0);

  const handlePrint = () => {
    setTab("planner");
    setTimeout(() => window.print(), 150);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5efe8",
        fontFamily: "Georgia, serif",
        color: "#3a2e24",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .mm { font-family: 'Cormorant Garamond', Georgia, serif; }
        .tab { background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer; font-family: 'Cormorant Garamond', Georgia, serif; font-size: .72rem; letter-spacing: .15em; padding: .6rem 1.8rem; color: #9e7a55; text-transform: uppercase; transition: all .2s; margin-bottom: -1px; }
        .tab.on { border-bottom-color: #c9a882; color: #3a2e24; font-weight: 600; }
        .card { background: #fff; border-radius: 2px; padding: 1.3rem 1.1rem; box-shadow: 0 1px 6px rgba(58,46,36,.07); }
        .irow { display: flex; justify-content: space-between; align-items: flex-start; padding: .5rem 0; border-bottom: 1px dotted #e0d4c8; gap: .8rem; }
        .irow:last-child { border-bottom: none; }
        .day { background: #fff; border-radius: 2px; padding: .85rem 1rem; box-shadow: 0 1px 5px rgba(58,46,36,.06); display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: .5rem; border-left: 3px solid #e0d4c8; margin-bottom: .7rem; transition: border-color .2s; }
        .day.filled { border-left-color: #c9a882; }
        .ebtn { background: none; border: 1px solid #e0d4c8; border-radius: 2px; cursor: pointer; padding: .18rem .4rem; font-size: .67rem; color: #9e7a55; font-family: inherit; transition: all .15s; }
        .ebtn.on { background: #c9a882; color: #fff; border-color: #c9a882; }
        .obtn { background: none; border: 1px solid #c9a882; border-radius: 2px; padding: .32rem .85rem; font-family: 'Cormorant Garamond', Georgia, serif; font-size: .82rem; color: #9e7a55; cursor: pointer; transition: all .2s; }
        .obtn:hover { background: #c9a882; color: #fff; }
        .overlay { position: fixed; inset: 0; background: rgba(58,46,36,.45); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal { background: #f5efe8; max-width: 430px; width: 100%; max-height: 80vh; overflow-y: auto; border-radius: 3px; padding: 1.6rem; box-shadow: 0 8px 40px rgba(58,46,36,.22); }
        .mitem { display: flex; justify-content: space-between; align-items: center; padding: .6rem .6rem; border-bottom: 1px dotted #e0d4c8; cursor: pointer; border-radius: 2px; transition: background .15s; }
        .mitem:hover { background: #ede4d8; }
        .mitem.selected { background: #ede4d8; border-left: 3px solid #c9a882; padding-left: .4rem; }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #c9a882, transparent); margin: .35rem 0; }
        .arch { border: 1px solid #e0d4c8; border-radius: 50% 50% 0 0/28px 28px 0 0; padding: 1.4rem 1.8rem 1.2rem; background: #fff; margin-top: 1.8rem; }
        .export-btn { background: none; border: 1px solid #c9a882; border-radius: 2px; padding: .4rem 1.1rem; font-family: 'Cormorant Garamond', Georgia, serif; font-size: .8rem; color: #9e7a55; cursor: pointer; transition: all .2s; letter-spacing: .05em; }
        .export-btn:hover { background: #c9a882; color: #fff; }
        .tag { display: inline-block; background: #f0e8df; border-radius: 2px; font-size: .7rem; padding: .1rem .4rem; margin: .15rem .15rem 0 0; font-style: italic; color: #7a5c3a; }
        .other-input { border: none; border-bottom: 1px solid #c9a882; background: transparent; font-family: 'Cormorant Garamond', Georgia, serif; font-size: .8rem; color: #3a2e24; outline: none; width: 140px; padding: .1rem 0; font-style: italic; }
        .checkmark { color: #c9a882; font-size: 1rem; margin-left: .4rem; flex-shrink: 0; }
        .print-only { display: none; }

        @media print {
          @page { margin: 1.5cm; size: A4 portrait; }
          body { background: #f5efe8 !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .day { box-shadow: none !important; break-inside: avoid; page-break-inside: avoid; }
          .arch { break-inside: avoid; page-break-inside: avoid; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "2rem 1rem .5rem" }}>
        <div
          style={{ color: "#c9a882", fontSize: ".6rem", letterSpacing: ".3em" }}
        >
          — ✦ —
        </div>
        <div
          className="mm"
          style={{
            fontSize: "clamp(2rem,7vw,3.4rem)",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.1,
            margin: ".4rem 0",
          }}
        >
          Movement
          <br />
          Menu
        </div>
        <div
          style={{ color: "#c9a882", fontSize: ".6rem", letterSpacing: ".3em" }}
        >
          — ✦ —
        </div>
      </div>

      {/* Tabs */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid #e0d4c8",
          margin: "1rem 0 1.8rem",
        }}
      >
        <button
          className={`tab${tab === "menu" ? " on" : ""}`}
          onClick={() => setTab("menu")}
        >
          The Menu
        </button>
        <button
          className={`tab${tab === "planner" ? " on" : ""}`}
          onClick={() => setTab("planner")}
        >
          This Week's Order
        </button>
      </div>

      {/* MENU TAB */}
      {tab === "menu" && (
        <div
          style={{
            maxWidth: 880,
            margin: "0 auto",
            padding: "0 1rem 3rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "1.2rem",
          }}
        >
          {Object.entries(menu).map(([sec, data]) => (
            <div key={sec} className="card">
              <div
                style={{
                  fontSize: ".68rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "#c9a882",
                  textAlign: "center",
                }}
              >
                {sec}
              </div>
              <div className="divider" />
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: ".75rem",
                  color: "#b8906a",
                  textAlign: "center",
                  marginBottom: ".7rem",
                }}
              >
                {data.sub}
              </div>
              {data.items.map((i) => (
                <div key={i.id} className="irow">
                  <div>
                    <div
                      style={{
                        fontSize: ".77rem",
                        fontWeight: 600,
                        letterSpacing: ".05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {i.name}
                    </div>
                    {i.desc && (
                      <div
                        style={{
                          fontStyle: "italic",
                          fontSize: ".73rem",
                          color: "#9e7a55",
                          marginTop: ".1rem",
                        }}
                      >
                        {i.desc}
                      </div>
                    )}
                    {i.isOther && (
                      <div
                        style={{
                          fontStyle: "italic",
                          fontSize: ".73rem",
                          color: "#b8906a",
                          marginTop: ".1rem",
                        }}
                      >
                        Create your own
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontStyle: "italic",
                      fontSize: ".8rem",
                      color: "#9e7a55",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {i.cost === 0 ? "$0" : "$" + i.cost}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* PLANNER TAB */}
      {tab === "planner" && (
        <div
          style={{ maxWidth: 680, margin: "0 auto", padding: "0 1rem 3rem" }}
        >
          <div
            className="no-print"
            style={{
              display: "flex",
              gap: ".7rem",
              justifyContent: "flex-end",
              marginBottom: "1.2rem",
            }}
          >
            <button className="export-btn" onClick={handlePrint}>
              ↓ Save / Print as PDF
            </button>
          </div>

          <div style={{ background: "#f5efe8", padding: "1rem" }}>
            <div
              className="print-only"
              style={{ textAlign: "center", marginBottom: "1.5rem" }}
            >
              <div
                style={{
                  fontSize: ".68rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "#c9a882",
                }}
              >
                This Week's Order
              </div>
              <div className="divider" />
            </div>

            {DAYS.map((day) => {
              const d = plan[day];
              const filled = d.items.length > 0;
              return (
                <div key={day} className={`day${filled ? " filled" : ""}`}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: ".62rem",
                        letterSpacing: ".2em",
                        color: "#c9a882",
                        textTransform: "uppercase",
                      }}
                    >
                      {day}
                    </div>
                    {filled ? (
                      <div
                        style={{
                          marginTop: ".25rem",
                          display: "flex",
                          flexWrap: "wrap",
                        }}
                      >
                        {d.items.map((i) => (
                          <span key={i.id} className="tag">
                            {i.name}
                            {i.cost > 0 ? ` $${i.cost}` : " free"}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          fontStyle: "italic",
                          color: "#c0b8b0",
                          fontSize: ".82rem",
                          marginTop: ".15rem",
                        }}
                      >
                        Rest day
                      </div>
                    )}
                    {filled && (
                      <div
                        style={{
                          fontSize: ".72rem",
                          color: "#9e7a55",
                          fontStyle: "italic",
                          marginTop: ".3rem",
                        }}
                      >
                        Day total: ${dayTotal(day)}
                      </div>
                    )}
                  </div>
                  <div
                    className="no-print"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".5rem",
                      flexWrap: "wrap",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ display: "flex", gap: ".2rem" }}>
                      {ENERGY.map((e) => (
                        <button
                          key={e}
                          className={`ebtn${d.energy === e ? " on" : ""}`}
                          onClick={() =>
                            setPlan((p) => ({
                              ...p,
                              [day]: { ...p[day], energy: e },
                            }))
                          }
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    <button className="obtn" onClick={() => setModal(day)}>
                      {filled ? "Edit order" : "+ Order"}
                    </button>
                  </div>
                  <div
                    className="print-only"
                    style={{
                      fontSize: ".7rem",
                      fontStyle: "italic",
                      color: "#9e7a55",
                    }}
                  >
                    Energy: {d.energy}
                  </div>
                </div>
              );
            })}

            <div className="arch">
              <div
                style={{
                  fontSize: ".68rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "#c9a882",
                  textAlign: "center",
                }}
              >
                Weekly Total
              </div>
              <div className="divider" />
              <div style={{ marginTop: ".8rem" }}>
                {secTotals.length === 0 ? (
                  <div
                    style={{
                      fontStyle: "italic",
                      color: "#c0b8b0",
                      fontSize: ".82rem",
                      textAlign: "center",
                    }}
                  >
                    Start ordering to see your total!
                  </div>
                ) : (
                  <>
                    {secTotals.map((s) => (
                      <div
                        key={s.sec}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: ".82rem",
                          color: "#7a5c3a",
                          marginBottom: ".3rem",
                        }}
                      >
                        <span>{s.sec}</span>
                        <span style={{ fontStyle: "italic" }}>
                          ×{s.count} — ${s.cost}
                        </span>
                      </div>
                    ))}
                    <div className="divider" style={{ margin: ".5rem 0" }} />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          fontSize: ".7rem",
                          letterSpacing: ".1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Total
                      </span>
                      <span style={{ fontStyle: "italic", color: "#9e7a55" }}>
                        ${weekTotal}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="overlay no-print" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: ".62rem",
                  letterSpacing: ".2em",
                  color: "#c9a882",
                  textTransform: "uppercase",
                }}
              >
                {modal}
              </div>
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  marginTop: ".2rem",
                }}
              >
                Choose your movement
              </div>
              <div
                style={{
                  fontSize: ".72rem",
                  color: "#9e7a55",
                  marginTop: ".2rem",
                  fontStyle: "italic",
                }}
              >
                Select as many as you like
              </div>
            </div>
            {Object.entries(menu).map(([sec, data]) => (
              <div key={sec} style={{ marginBottom: ".8rem" }}>
                <div
                  style={{
                    fontSize: ".6rem",
                    letterSpacing: ".18em",
                    color: "#c9a882",
                    textTransform: "uppercase",
                    padding: ".2rem 0",
                  }}
                >
                  {sec}
                </div>
                {data.items.map((item) => {
                  const selected = isSelected(modal, item.id);
                  const otherKey = `${modal}-${item.id}`;
                  return (
                    <div
                      key={item.id}
                      className={`mitem${selected ? " selected" : ""}`}
                      onClick={() => {
                        if (item.isOther) {
                          toggleItem(modal, item, otherInputs[otherKey]);
                        } else {
                          toggleItem(modal, item);
                        }
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: ".8rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: ".04em",
                          }}
                        >
                          {item.name}
                        </div>
                        {item.desc && (
                          <div
                            style={{
                              fontStyle: "italic",
                              fontSize: ".72rem",
                              color: "#9e7a55",
                            }}
                          >
                            {item.desc}
                          </div>
                        )}
                        {item.isOther && (
                          <input
                            className="other-input"
                            placeholder="Describe your activity…"
                            value={otherInputs[otherKey] || ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setOtherInputs((o) => ({
                                ...o,
                                [otherKey]: e.target.value,
                              }))
                            }
                          />
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".3rem",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            fontStyle: "italic",
                            fontSize: ".8rem",
                            color: "#9e7a55",
                          }}
                        >
                          {item.cost === 0 ? "Free" : "$" + item.cost}
                        </div>
                        {selected && <span className="checkmark">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <button
              style={{
                width: "100%",
                marginTop: "1rem",
                padding: ".55rem",
                background: "#c9a882",
                border: "none",
                color: "#fff",
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: ".85rem",
                letterSpacing: ".1em",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
              onClick={() => setModal(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
