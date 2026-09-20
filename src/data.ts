export type Stage = readonly [title: string, description: string];

export type Project = {
  location: string;
  title: string;
  body: string;
  question: string;
  method: string;
};

export const stages: Stage[] = [
  ["OBSERVE", "Look before proposing. Site, people, context, evidence and constraints become the first material."],
  ["MAP", "Make relationships visible. Geography, movement, capital, infrastructure and behaviour become legible."],
  ["UNDERSTAND", "Find the forces underneath the visible problem and identify what the brief is really asking."],
  ["QUESTION", "Challenge assumptions, boundaries and inherited answers before committing to form."],
  ["DESIGN", "Turn understanding into an intervention with a clear argument."],
  ["TEST", "Model consequences, expose weak assumptions and iterate before reality does it for us."],
  ["BUILD / ADVISE", "Equip the client and specialist teams to act with coherent documentation and decisions."],
  ["OBSERVE AGAIN", "Return to the field. The work changes the system, so the system becomes evidence for what comes next."]
];

export const projects: Project[] = [
  {
    location: "LAGOS · CIVIC",
    title: "Lagos Civic Exchange",
    body: "A civic and mobility system studied as one urban condition. The engagement looks beyond the visible public-space brief to movement, access, programme, surrounding commerce and the behaviours those systems produce.",
    question: "How does a civic place work when movement is treated as part of the architecture?",
    method: "Observe · Map · Understand · Design · Test"
  },
  {
    location: "ABA · INDUSTRIAL",
    title: "Aba Production City",
    body: "An industrial growth question approached through production networks, labour, logistics, movement and place. The project treats the production ecosystem as the subject rather than the building alone.",
    question: "What infrastructure does a production city actually need to keep producing?",
    method: "Map · Understand · Question · Design · Test"
  },
  {
    location: "MAKOKO · WATER EDGE",
    title: "Water Edge Study",
    body: "A water-edge investigation that treats the shoreline as a living system. Settlement, access, ecology, livelihoods and development pressure are considered together.",
    question: "Where does the project boundary end when the water keeps moving?",
    method: "Observe · Map · Question · Test · Observe Again"
  },
  {
    location: "LEKKI · LOGISTICS",
    title: "Logistics & Coastal Plan",
    body: "A systems study connecting freight, access, coastal conditions and development pressure. The work explores how infrastructure decisions compound across a growing territory.",
    question: "What happens when logistics, coastline and development are planned as separate systems?",
    method: "Observe · Map · Understand · Model · Advise"
  }
];

export const routeCopy: Record<string, string> = {
  "We have an ambition.": "Bring us the ambition before it becomes a fixed solution. We can help clarify the system, the questions and the work required.",
  "We have a site.": "A site is more than a boundary. Tell us what you know about it and what you are considering, and we can begin from context.",
  "We have a project in motion.": "Bring the current state, the assumptions and the points of friction. The next useful step may be design, research, testing or independent advice.",
  "We have a question.": "Good. Questions are often where useful work begins. Tell us what you are trying to understand.",
  "We need an independent view.": "Bring the decision you are trying to make and the evidence you already have. Independence starts with a clear question.",
  "We want to collaborate.": "Tell us what you are building, researching or convening and where another discipline could make the work stronger."
};
