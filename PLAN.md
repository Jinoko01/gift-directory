# Gift Preference Dex Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React webview mini app for Apps in Toss where users create cute gift preference profiles and receive budget-based gift recommendations.

**Architecture:** Keep the app client-first for MVP speed, with deterministic recommendation rules in pure TypeScript and Firebase access isolated behind service modules. Use TDS Mobile for core UI controls, local CSS only for app-specific white-base layout, gift cards, and tag visuals.

**Tech Stack:** Vite, React, TypeScript, TDS Mobile (`@toss/tds-mobile`), Firebase Auth, Cloud Firestore, Vitest, React Testing Library, ESLint, Prettier.

---

## File Structure

Create or converge on this structure:

```text
src/
  app/
    App.tsx
    app.css
  components/
    EmptyState.tsx
    GiftRecommendationCard.tsx
    PersonCard.tsx
    TasteTagSelector.tsx
  features/
    people/
      peopleFixtures.ts
      peopleService.ts
      peopleTypes.ts
      PeopleListPage.tsx
      PersonProfilePage.tsx
    recommendations/
      recommendationRules.test.ts
      recommendationRules.ts
      recommendationTypes.ts
      RecommendationFlowPage.tsx
      RecommendationResultPage.tsx
  firebase/
    firebaseApp.ts
    firestore.ts
  styles/
    global.css
    tokens.css
  test/
    setup.ts
  main.tsx
```

Remove starter-only files after replacement:

```text
src/App.jsx
src/App.css
src/main.jsx
src/assets/react.svg
src/assets/vite.svg
```

Keep:

```text
AGENTS.md
eslint.config.js
package.json
pnpm-lock.yaml
ui-ux-guide/
```

---

### Task 1: Project Cleanup and Baseline Commands

**Files:**

- Modify: `package.json`
- Modify: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/app.css`
- Create: `src/styles/global.css`
- Create: `src/styles/tokens.css`
- Delete later: `src/App.jsx`, `src/App.tsx`, `src/App.css`, `src/main.jsx`

- [ ] **Step 1: Add required dependencies**

Run:

```bash
pnpm add @toss/tds-mobile firebase
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: `package.json` and `pnpm-lock.yaml` include TDS Mobile, Firebase, and test packages.

- [ ] **Step 2: Update scripts in `package.json`**

Set scripts to:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "format": "prettier --write .",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Replace `src/main.tsx`**

Use:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./styles/tokens.css";
import "./styles/global.css";

const rootElement = document.getElementById("root");

if (rootElement == null) {
  throw new Error("Root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 4: Create minimal `src/app/App.tsx`**

Use:

```tsx
import "./app.css";

export function App() {
  return (
    <main className="appShell">
      <section className="appIntro">
        <p className="appEyebrow">선물 취향 도감</p>
        <h1>취향을 모아두고 선물을 고르세요</h1>
        <p>소중한 사람의 좋아하는 것과 피해야 할 것을 기록해요.</p>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Create white-base CSS tokens**

Use `src/styles/tokens.css`:

```css
:root {
  --color-background: #ffffff;
  --color-surface: #ffffff;
  --color-surface-subtle: #f7f9fb;
  --color-text: #191f28;
  --color-text-muted: #6b7684;
  --color-border: #e5e8eb;
  --color-primary: #3182f6;
  --color-mint: #e5fbf4;
  --color-pink: #fff0f5;
  --color-yellow: #fff8dd;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

Use `src/styles/global.css`:

```css
* {
  box-sizing: border-box;
}

html {
  background: var(--color-background);
}

body {
  margin: 0;
  min-width: 320px;
  color: var(--color-text);
  background: var(--color-background);
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

button,
input,
textarea,
select {
  font: inherit;
}
```

Use `src/app/app.css`:

```css
.appShell {
  min-height: 100svh;
  padding: 24px 20px calc(24px + var(--safe-bottom));
  background: var(--color-background);
}

.appIntro {
  display: grid;
  gap: 12px;
}

.appIntro h1 {
  margin: 0;
  font-size: 28px;
  line-height: 1.25;
  letter-spacing: 0;
}

.appIntro p {
  margin: 0;
  color: var(--color-text-muted);
}

.appEyebrow {
  font-weight: 700;
  color: var(--color-primary);
}
```

- [ ] **Step 6: Remove starter files**

Delete:

```bash
rm src/App.jsx src/App.css src/main.jsx src/assets/react.svg src/assets/vite.svg
```

On Windows PowerShell use:

```powershell
Remove-Item -LiteralPath src\App.jsx,src\App.css,src\main.jsx,src\assets\react.svg,src\assets\vite.svg
```

- [ ] **Step 7: Verify baseline**

Run:

```bash
pnpm run lint
pnpm run build
```

Expected: both commands pass.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml src
git commit -m "chore: reset app baseline"
```

---

### Task 2: Domain Types and Fixtures

**Files:**

- Create: `src/features/people/peopleTypes.ts`
- Create: `src/features/people/peopleFixtures.ts`
- Create: `src/features/recommendations/recommendationTypes.ts`

- [ ] **Step 1: Create people types**

Use `src/features/people/peopleTypes.ts`:

```ts
export type Relationship =
  | "friend"
  | "partner"
  | "family"
  | "coworker"
  | "other";

export interface GiftPerson {
  id: string;
  name: string;
  relationship: Relationship;
  favoriteColors: string[];
  favoriteAnimals: string[];
  favoriteStyles: string[];
  hobbies: string[];
  avoidItems: string[];
  preferredBudgetMin: number;
  preferredBudgetMax: number;
  specialDates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GiftPersonInput {
  name: string;
  relationship: Relationship;
  favoriteColors: string[];
  favoriteAnimals: string[];
  favoriteStyles: string[];
  hobbies: string[];
  avoidItems: string[];
  preferredBudgetMin: number;
  preferredBudgetMax: number;
  specialDates: string[];
}
```

- [ ] **Step 2: Create recommendation types**

Use `src/features/recommendations/recommendationTypes.ts`:

```ts
import type { GiftPerson } from "../people/peopleTypes";

export type GiftOccasion =
  | "birthday"
  | "thanks"
  | "comfort"
  | "anniversary"
  | "cuteBoost";

export interface BudgetRange {
  min: number;
  max: number;
}

export interface GiftRecommendation {
  id: string;
  title: string;
  reason: string;
  cutePoint: string;
  caution: string;
  estimatedPrice: BudgetRange;
  matchedTags: string[];
}

export interface RecommendationRequest {
  person: GiftPerson;
  occasion: GiftOccasion;
  budget: BudgetRange;
}
```

- [ ] **Step 3: Create sample people**

Use `src/features/people/peopleFixtures.ts`:

```ts
import type { GiftPerson } from "./peopleTypes";

export const samplePeople: GiftPerson[] = [
  {
    id: "minji",
    name: "민지",
    relationship: "friend",
    favoriteColors: ["민트색", "하늘색"],
    favoriteAnimals: ["고양이"],
    favoriteStyles: ["말랑한 것", "작은 소품"],
    hobbies: ["문구", "카페"],
    avoidItems: ["향 강한 제품", "큰 인형"],
    preferredBudgetMin: 10000,
    preferredBudgetMax: 30000,
    specialDates: ["2026-06-18"],
    createdAt: "2026-05-12T00:00:00.000Z",
    updatedAt: "2026-05-12T00:00:00.000Z",
  },
];
```

- [ ] **Step 4: Run lint**

Run:

```bash
pnpm run lint
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features
git commit -m "feat: define gift domain types"
```

---

### Task 3: Recommendation Rules with TDD

**Files:**

- Create: `src/features/recommendations/recommendationRules.test.ts`
- Create: `src/features/recommendations/recommendationRules.ts`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Configure Vitest**

Modify `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Write failing recommendation tests**

Use `src/features/recommendations/recommendationRules.test.ts`:

```ts
import { samplePeople } from "../people/peopleFixtures";
import { createGiftRecommendations } from "./recommendationRules";

describe("createGiftRecommendations", () => {
  it("returns three recommendations inside the selected budget", () => {
    const recommendations = createGiftRecommendations({
      person: samplePeople[0],
      occasion: "birthday",
      budget: { min: 0, max: 30000 },
    });

    expect(recommendations).toHaveLength(3);
    expect(
      recommendations.every(
        (recommendation) => recommendation.estimatedPrice.max <= 30000,
      ),
    ).toBe(true);
  });

  it("uses the person's taste tags in recommendation reasons", () => {
    const recommendations = createGiftRecommendations({
      person: samplePeople[0],
      occasion: "thanks",
      budget: { min: 0, max: 30000 },
    });

    expect(recommendations[0].matchedTags.length).toBeGreaterThan(0);
    expect(recommendations[0].reason).toContain("민지");
  });

  it("does not recommend avoid items in titles", () => {
    const recommendations = createGiftRecommendations({
      person: samplePeople[0],
      occasion: "cuteBoost",
      budget: { min: 0, max: 50000 },
    });

    expect(
      recommendations.some((recommendation) =>
        samplePeople[0].avoidItems.some((avoidItem) =>
          recommendation.title.includes(avoidItem),
        ),
      ),
    ).toBe(false);
  });
});
```

- [ ] **Step 3: Run test and verify it fails**

Run:

```bash
pnpm run test
```

Expected: FAIL because `recommendationRules.ts` does not exist.

- [ ] **Step 4: Implement deterministic rules**

Use `src/features/recommendations/recommendationRules.ts`:

```ts
import type {
  GiftRecommendation,
  RecommendationRequest,
} from "./recommendationTypes";

interface GiftTemplate {
  title: string;
  baseMin: number;
  baseMax: number;
  tags: string[];
  cutePoint: string;
}

const giftTemplates: GiftTemplate[] = [
  {
    title: "작은 파우치",
    baseMin: 12000,
    baseMax: 28000,
    tags: ["작은 소품", "문구", "민트색", "하늘색"],
    cutePoint: "가방 안에서 매일 보이는 작고 실용적인 귀여움이에요.",
  },
  {
    title: "말랑 키링 세트",
    baseMin: 8000,
    baseMax: 22000,
    tags: ["말랑한 것", "고양이", "작은 소품"],
    cutePoint: "취향을 바로 드러내기 좋고 부담이 적어요.",
  },
  {
    title: "데스크 미니 피규어",
    baseMin: 15000,
    baseMax: 35000,
    tags: ["고양이", "작은 소품", "카페"],
    cutePoint: "책상 위에 두면 자주 떠올릴 수 있는 선물이에요.",
  },
  {
    title: "스티커와 메모지 묶음",
    baseMin: 5000,
    baseMax: 18000,
    tags: ["문구", "민트색", "하늘색"],
    cutePoint: "가볍게 고마움을 전하기 좋은 실용 소품이에요.",
  },
  {
    title: "카페 기프트 카드",
    baseMin: 10000,
    baseMax: 30000,
    tags: ["카페"],
    cutePoint: "취향을 크게 벗어나지 않는 안전한 선택이에요.",
  },
];

export function createGiftRecommendations({
  person,
  occasion,
  budget,
}: RecommendationRequest): GiftRecommendation[] {
  const tasteTags = [
    ...person.favoriteColors,
    ...person.favoriteAnimals,
    ...person.favoriteStyles,
    ...person.hobbies,
  ];

  return giftTemplates
    .filter((template) => template.baseMin >= budget.min)
    .filter((template) => template.baseMax <= budget.max)
    .filter((template) =>
      person.avoidItems.every(
        (avoidItem) => !template.title.includes(avoidItem),
      ),
    )
    .map((template) => {
      const matchedTags = template.tags.filter((tag) =>
        tasteTags.includes(tag),
      );

      return {
        id: template.title.replaceAll(" ", "-"),
        title: decorateTitle(template.title, matchedTags),
        reason: createReason(person.name, occasion, matchedTags),
        cutePoint: template.cutePoint,
        caution: createCaution(person.avoidItems),
        estimatedPrice: {
          min: template.baseMin,
          max: template.baseMax,
        },
        matchedTags,
      };
    })
    .sort((left, right) => right.matchedTags.length - left.matchedTags.length)
    .slice(0, 3);
}

function decorateTitle(title: string, matchedTags: string[]) {
  const primaryTag = matchedTags[0];

  if (primaryTag == null) {
    return title;
  }

  return `${primaryTag} ${title}`;
}

function createReason(
  personName: string,
  occasion: RecommendationRequest["occasion"],
  matchedTags: string[],
) {
  const occasionLabel = getOccasionLabel(occasion);
  const tagLabel =
    matchedTags.length > 0 ? matchedTags.join(", ") : "평소 취향";

  return `${personName}님의 ${tagLabel} 취향과 ${occasionLabel} 상황에 잘 맞아요.`;
}

function createCaution(avoidItems: string[]) {
  if (avoidItems.length === 0) {
    return "특별히 피해야 할 취향은 아직 없어요.";
  }

  return `${avoidItems.join(", ")}은 피해서 고르는 게 좋아요.`;
}

function getOccasionLabel(occasion: RecommendationRequest["occasion"]) {
  const labels: Record<RecommendationRequest["occasion"], string> = {
    birthday: "생일",
    thanks: "고마움 표현",
    comfort: "위로",
    anniversary: "기념일",
    cuteBoost: "귀여움 충전",
  };

  return labels[occasion];
}
```

- [ ] **Step 5: Run tests**

Run:

```bash
pnpm run test
```

Expected: PASS.

- [ ] **Step 6: Run lint**

Run:

```bash
pnpm run lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add vite.config.ts src/test src/features/recommendations
git commit -m "feat: add deterministic gift recommendations"
```

---

### Task 4: Firebase Setup and Data Service

**Files:**

- Create: `.env.example`
- Create: `src/firebase/firebaseApp.ts`
- Create: `src/firebase/firestore.ts`
- Create: `src/features/people/peopleService.ts`

- [ ] **Step 1: Create `.env.example`**

Use:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

- [ ] **Step 2: Create Firebase app module**

Use `src/firebase/firebaseApp.ts`:

```ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
```

- [ ] **Step 3: Create Firestore module**

Use `src/firebase/firestore.ts`:

```ts
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./firebaseApp";

export const firestore = getFirestore(firebaseApp);
```

- [ ] **Step 4: Create people service**

Use `src/features/people/peopleService.ts`:

```ts
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../../firebase/firestore";
import type { GiftPerson, GiftPersonInput } from "./peopleTypes";

const fallbackUserId = "anonymous-demo-user";

export async function listPeople(
  userId = fallbackUserId,
): Promise<GiftPerson[]> {
  const peopleQuery = query(
    collection(firestore, "users", userId, "people"),
    orderBy("updatedAt", "desc"),
  );
  const snapshot = await getDocs(peopleQuery);

  return snapshot.docs.map((document) => {
    const data = document.data() as Omit<GiftPerson, "id">;

    return {
      ...data,
      id: document.id,
    };
  });
}

export async function createPerson(
  input: GiftPersonInput,
  userId = fallbackUserId,
) {
  const now = new Date().toISOString();

  return addDoc(collection(firestore, "users", userId, "people"), {
    ...input,
    createdAt: now,
    updatedAt: now,
    serverUpdatedAt: serverTimestamp(),
  });
}
```

- [ ] **Step 5: Run lint and build**

Run:

```bash
pnpm run lint
pnpm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add .env.example src/firebase src/features/people/peopleService.ts
git commit -m "feat: configure firebase data access"
```

---

### Task 5: Core Reusable UI Components

**Files:**

- Create: `src/components/PersonCard.tsx`
- Create: `src/components/TasteTagSelector.tsx`
- Create: `src/components/GiftRecommendationCard.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/components.css`
- Modify: `src/app/App.tsx`

- [ ] **Step 1: Create component CSS**

Use `src/components/components.css`:

```css
.personCard,
.recommendationCard,
.emptyState {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-surface);
}

.personCard,
.recommendationCard {
  display: grid;
  gap: 10px;
  padding: 16px;
}

.personCardHeader,
.recommendationCardHeader {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.tagList {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tasteTag {
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 7px 10px;
  color: var(--color-text);
  background: var(--color-surface-subtle);
}

.tasteTagSelected {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #eef6ff;
}

.emptyState {
  padding: 28px 18px;
  text-align: center;
}
```

- [ ] **Step 2: Create `PersonCard`**

Use `src/components/PersonCard.tsx`:

```tsx
import type { GiftPerson } from "../features/people/peopleTypes";
import "./components.css";

interface PersonCardProps {
  person: GiftPerson;
  onSelect: (person: GiftPerson) => void;
}

export function PersonCard({ person, onSelect }: PersonCardProps) {
  const tags = [
    ...person.favoriteColors,
    ...person.favoriteAnimals,
    ...person.favoriteStyles,
  ].slice(0, 3);

  return (
    <button
      className="personCard"
      type="button"
      onClick={() => onSelect(person)}
    >
      <span className="personCardHeader">
        <strong>{person.name}</strong>
        <span>{getRelationshipLabel(person.relationship)}</span>
      </span>
      <span className="tagList">
        {tags.map((tag) => (
          <span className="tasteTag" key={tag}>
            {tag}
          </span>
        ))}
      </span>
    </button>
  );
}

function getRelationshipLabel(relationship: GiftPerson["relationship"]) {
  const labels: Record<GiftPerson["relationship"], string> = {
    friend: "친구",
    partner: "연인",
    family: "가족",
    coworker: "동료",
    other: "기타",
  };

  return labels[relationship];
}
```

- [ ] **Step 3: Create `TasteTagSelector`**

Use `src/components/TasteTagSelector.tsx`:

```tsx
import "./components.css";

interface TasteTagSelectorProps {
  label: string;
  options: string[];
  selectedTags: string[];
  onChange: (selectedTags: string[]) => void;
}

export function TasteTagSelector({
  label,
  options,
  selectedTags,
  onChange,
}: TasteTagSelectorProps) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className="tagList">
        {options.map((option) => {
          const isSelected = selectedTags.includes(option);

          return (
            <button
              className={isSelected ? "tasteTag tasteTagSelected" : "tasteTag"}
              key={option}
              type="button"
              onClick={() => {
                onChange(
                  isSelected
                    ? selectedTags.filter((tag) => tag !== option)
                    : [...selectedTags, option],
                );
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
```

- [ ] **Step 4: Create `GiftRecommendationCard`**

Use `src/components/GiftRecommendationCard.tsx`:

```tsx
import type { GiftRecommendation } from "../features/recommendations/recommendationTypes";
import "./components.css";

interface GiftRecommendationCardProps {
  recommendation: GiftRecommendation;
}

export function GiftRecommendationCard({
  recommendation,
}: GiftRecommendationCardProps) {
  return (
    <article className="recommendationCard">
      <header className="recommendationCardHeader">
        <strong>{recommendation.title}</strong>
        <span>
          {recommendation.estimatedPrice.min.toLocaleString()}-
          {recommendation.estimatedPrice.max.toLocaleString()}원
        </span>
      </header>
      <p>{recommendation.reason}</p>
      <p>{recommendation.cutePoint}</p>
      <small>{recommendation.caution}</small>
    </article>
  );
}
```

- [ ] **Step 5: Create `EmptyState`**

Use `src/components/EmptyState.tsx`:

```tsx
import "./components.css";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="emptyState">
      <strong>{title}</strong>
      <p>{description}</p>
    </section>
  );
}
```

- [ ] **Step 6: Run lint and build**

Run:

```bash
pnpm run lint
pnpm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components
git commit -m "feat: add gift app UI primitives"
```

---

### Task 6: People List and Profile Creation Flow

**Files:**

- Create: `src/features/people/PeopleListPage.tsx`
- Create: `src/features/people/PersonProfilePage.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/app.css`

- [ ] **Step 1: Create people list page**

Use `src/features/people/PeopleListPage.tsx`:

```tsx
import { PersonCard } from "../../components/PersonCard";
import { EmptyState } from "../../components/EmptyState";
import type { GiftPerson } from "./peopleTypes";

interface PeopleListPageProps {
  people: GiftPerson[];
  onCreate: () => void;
  onSelect: (person: GiftPerson) => void;
}

export function PeopleListPage({
  people,
  onCreate,
  onSelect,
}: PeopleListPageProps) {
  return (
    <section className="pageStack">
      <header className="pageHeader">
        <p className="appEyebrow">선물 취향 도감</p>
        <h1>누구의 선물을 고를까요?</h1>
        <p>좋아하는 것과 피해야 할 것을 사람별로 모아둘 수 있어요.</p>
      </header>
      <button className="primaryButton" type="button" onClick={onCreate}>
        취향 도감 만들기
      </button>
      {people.length === 0 ? (
        <EmptyState
          title="아직 저장한 사람이 없어요"
          description="첫 번째 취향 도감을 만들고 선물 추천을 받아보세요."
        />
      ) : (
        <div className="cardList">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Create profile page**

Use `src/features/people/PersonProfilePage.tsx`:

```tsx
import { useState } from "react";
import { TasteTagSelector } from "../../components/TasteTagSelector";
import type { GiftPersonInput } from "./peopleTypes";

const colorOptions = ["민트색", "하늘색", "분홍색", "노란색"];
const animalOptions = ["고양이", "강아지", "토끼", "곰"];
const styleOptions = ["말랑한 것", "작은 소품", "실용적인 것", "반짝이는 것"];
const hobbyOptions = ["문구", "카페", "독서", "인테리어"];

interface PersonProfilePageProps {
  onBack: () => void;
  onSave: (input: GiftPersonInput) => void;
}

export function PersonProfilePage({ onBack, onSave }: PersonProfilePageProps) {
  const [name, setName] = useState("");
  const [favoriteColors, setFavoriteColors] = useState<string[]>([]);
  const [favoriteAnimals, setFavoriteAnimals] = useState<string[]>([]);
  const [favoriteStyles, setFavoriteStyles] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [avoidItems, setAvoidItems] = useState("");

  const canSave = name.trim().length > 0;

  return (
    <section className="pageStack">
      <button className="textButton" type="button" onClick={onBack}>
        돌아가기
      </button>
      <header className="pageHeader">
        <h1>취향 도감을 만들어요</h1>
        <p>아는 만큼 선물 고르기가 쉬워져요.</p>
      </header>
      <label className="fieldStack">
        이름
        <input
          value={name}
          placeholder="예: 민지"
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <TasteTagSelector
        label="좋아하는 색"
        options={colorOptions}
        selectedTags={favoriteColors}
        onChange={setFavoriteColors}
      />
      <TasteTagSelector
        label="좋아하는 동물"
        options={animalOptions}
        selectedTags={favoriteAnimals}
        onChange={setFavoriteAnimals}
      />
      <TasteTagSelector
        label="좋아하는 느낌"
        options={styleOptions}
        selectedTags={favoriteStyles}
        onChange={setFavoriteStyles}
      />
      <TasteTagSelector
        label="취미"
        options={hobbyOptions}
        selectedTags={hobbies}
        onChange={setHobbies}
      />
      <label className="fieldStack">
        피해야 할 선물
        <input
          value={avoidItems}
          placeholder="예: 향 강한 제품, 큰 인형"
          onChange={(event) => setAvoidItems(event.target.value)}
        />
      </label>
      <button
        className="primaryButton"
        type="button"
        disabled={!canSave}
        onClick={() =>
          onSave({
            name: name.trim(),
            relationship: "friend",
            favoriteColors,
            favoriteAnimals,
            favoriteStyles,
            hobbies,
            avoidItems: avoidItems
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            preferredBudgetMin: 0,
            preferredBudgetMax: 30000,
            specialDates: [],
          })
        }
      >
        저장하기
      </button>
    </section>
  );
}
```

- [ ] **Step 3: Add page layout CSS**

Append to `src/app/app.css`:

```css
.pageStack,
.cardList,
.fieldStack {
  display: grid;
  gap: 16px;
}

.pageHeader {
  display: grid;
  gap: 8px;
}

.pageHeader h1 {
  margin: 0;
  font-size: 28px;
  line-height: 1.25;
  letter-spacing: 0;
}

.pageHeader p {
  margin: 0;
  color: var(--color-text-muted);
}

.primaryButton,
.textButton {
  min-height: 48px;
  border: 0;
  border-radius: 12px;
}

.primaryButton {
  color: #ffffff;
  background: var(--color-primary);
}

.primaryButton:disabled {
  color: var(--color-text-muted);
  background: var(--color-surface-subtle);
}

.textButton {
  justify-self: start;
  padding: 0;
  color: var(--color-primary);
  background: transparent;
}

.fieldStack {
  color: var(--color-text);
  font-weight: 700;
}

.fieldStack input {
  width: 100%;
  min-height: 48px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0 14px;
}
```

- [ ] **Step 4: Wire pages in `App.tsx`**

Use `src/app/App.tsx`:

```tsx
import { useState } from "react";
import { PeopleListPage } from "../features/people/PeopleListPage";
import { PersonProfilePage } from "../features/people/PersonProfilePage";
import { samplePeople } from "../features/people/peopleFixtures";
import type {
  GiftPerson,
  GiftPersonInput,
} from "../features/people/peopleTypes";
import "./app.css";

type AppView = "people" | "profile";

export function App() {
  const [view, setView] = useState<AppView>("people");
  const [people, setPeople] = useState<GiftPerson[]>(samplePeople);

  if (view === "profile") {
    return (
      <main className="appShell">
        <PersonProfilePage
          onBack={() => setView("people")}
          onSave={(input) => {
            setPeople((currentPeople) => [
              createLocalPerson(input),
              ...currentPeople,
            ]);
            setView("people");
          }}
        />
      </main>
    );
  }

  return (
    <main className="appShell">
      <PeopleListPage
        people={people}
        onCreate={() => setView("profile")}
        onSelect={() => setView("people")}
      />
    </main>
  );
}

function createLocalPerson(input: GiftPersonInput): GiftPerson {
  const now = new Date().toISOString();

  return {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}
```

- [ ] **Step 5: Run lint and build**

Run:

```bash
pnpm run lint
pnpm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app src/features/people src/components
git commit -m "feat: add people profile flow"
```

---

### Task 7: Recommendation Flow and Result Cards

**Files:**

- Create: `src/features/recommendations/RecommendationFlowPage.tsx`
- Create: `src/features/recommendations/RecommendationResultPage.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/app.css`

- [ ] **Step 1: Create recommendation flow page**

Use `src/features/recommendations/RecommendationFlowPage.tsx`:

```tsx
import type { GiftPerson } from "../people/peopleTypes";
import type { BudgetRange, GiftOccasion } from "./recommendationTypes";

const budgets: BudgetRange[] = [
  { min: 0, max: 10000 },
  { min: 0, max: 30000 },
  { min: 0, max: 50000 },
];

interface RecommendationFlowPageProps {
  person: GiftPerson;
  onBack: () => void;
  onSubmit: (occasion: GiftOccasion, budget: BudgetRange) => void;
}

export function RecommendationFlowPage({
  person,
  onBack,
  onSubmit,
}: RecommendationFlowPageProps) {
  return (
    <section className="pageStack">
      <button className="textButton" type="button" onClick={onBack}>
        돌아가기
      </button>
      <header className="pageHeader">
        <h1>{person.name}님 선물을 골라볼게요</h1>
        <p>상황과 예산을 고르면 취향에 맞춰 추천해요.</p>
      </header>
      <div className="optionGrid">
        {budgets.map((budget) => (
          <button
            className="optionButton"
            key={budget.max}
            type="button"
            onClick={() => onSubmit("birthday", budget)}
          >
            {budget.max.toLocaleString()}원 이하
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create recommendation result page**

Use `src/features/recommendations/RecommendationResultPage.tsx`:

```tsx
import { GiftRecommendationCard } from "../../components/GiftRecommendationCard";
import { createGiftRecommendations } from "./recommendationRules";
import type { RecommendationRequest } from "./recommendationTypes";

interface RecommendationResultPageProps {
  request: RecommendationRequest;
  onBack: () => void;
  onRestart: () => void;
}

export function RecommendationResultPage({
  request,
  onBack,
  onRestart,
}: RecommendationResultPageProps) {
  const recommendations = createGiftRecommendations(request);

  return (
    <section className="pageStack">
      <button className="textButton" type="button" onClick={onBack}>
        조건 다시 고르기
      </button>
      <header className="pageHeader">
        <h1>{request.person.name}님에게 어울리는 선물이에요</h1>
        <p>취향 태그와 예산을 함께 보고 골랐어요.</p>
      </header>
      <div className="cardList">
        {recommendations.map((recommendation) => (
          <GiftRecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
          />
        ))}
      </div>
      <button className="primaryButton" type="button" onClick={onRestart}>
        다른 사람 선물 고르기
      </button>
    </section>
  );
}
```

- [ ] **Step 3: Add option grid CSS**

Append to `src/app/app.css`:

```css
.optionGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.optionButton {
  min-height: 52px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  color: var(--color-text);
  background: var(--color-surface);
}
```

- [ ] **Step 4: Wire recommendation views in `App.tsx`**

Modify `src/app/App.tsx` so it manages:

```ts
type AppView =
  | "people"
  | "profile"
  | "recommendationFlow"
  | "recommendationResult";
```

Add state:

```ts
const [selectedPerson, setSelectedPerson] = useState<GiftPerson | null>(null);
const [recommendationRequest, setRecommendationRequest] =
  useState<RecommendationRequest | null>(null);
```

Use `onSelect`:

```tsx
onSelect={(person) => {
  setSelectedPerson(person);
  setView("recommendationFlow");
}}
```

Render flow when selected:

```tsx
if (view === "recommendationFlow" && selectedPerson != null) {
  return (
    <main className="appShell">
      <RecommendationFlowPage
        person={selectedPerson}
        onBack={() => setView("people")}
        onSubmit={(occasion, budget) => {
          setRecommendationRequest({
            person: selectedPerson,
            occasion,
            budget,
          });
          setView("recommendationResult");
        }}
      />
    </main>
  );
}
```

Render result:

```tsx
if (view === "recommendationResult" && recommendationRequest != null) {
  return (
    <main className="appShell">
      <RecommendationResultPage
        request={recommendationRequest}
        onBack={() => setView("recommendationFlow")}
        onRestart={() => setView("people")}
      />
    </main>
  );
}
```

Import:

```ts
import { RecommendationFlowPage } from "../features/recommendations/RecommendationFlowPage";
import { RecommendationResultPage } from "../features/recommendations/RecommendationResultPage";
import type { RecommendationRequest } from "../features/recommendations/recommendationTypes";
```

- [ ] **Step 5: Run tests, lint, build**

Run:

```bash
pnpm run test
pnpm run lint
pnpm run build
```

Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app src/features/recommendations
git commit -m "feat: add recommendation flow"
```

---

### Task 8: Apply TDS Mobile Components

**Files:**

- Modify: `src/features/people/PeopleListPage.tsx`
- Modify: `src/features/people/PersonProfilePage.tsx`
- Modify: `src/features/recommendations/RecommendationFlowPage.tsx`
- Modify: `src/features/recommendations/RecommendationResultPage.tsx`
- Modify: `src/components/*.tsx`

- [ ] **Step 1: Identify available TDS exports locally**

Run:

```bash
pnpm why @toss/tds-mobile
```

Expected: package is installed.

Then inspect package exports:

```bash
node -e "import('@toss/tds-mobile').then((m)=>console.log(Object.keys(m).sort().join('\n')))"
```

Expected: printed component exports. Use the real exported names in the next steps.

- [ ] **Step 2: Replace plain primary buttons with TDS buttons**

Where TDS exports `Button`, replace:

```tsx
<button className="primaryButton" type="button" onClick={onCreate}>
  취향 도감 만들기
</button>
```

with:

```tsx
<Button type="primary" onClick={onCreate}>
  취향 도감 만들기
</Button>
```

If the installed TDS package uses a different prop name, use the package's exported TypeScript type as source of truth and keep the visible copy unchanged.

- [ ] **Step 3: Replace text inputs with TDS text fields**

Where TDS exports `TextField`, replace native name input with:

```tsx
<TextField
  label="이름"
  value={name}
  placeholder="예: 민지"
  onChange={(event) => setName(event.target.value)}
/>
```

If the installed package uses `TextField.Input`, follow that API and keep label, value, placeholder, and onChange behavior identical.

- [ ] **Step 4: Replace modal-like future surfaces with TDS bottom sheet or dialog only when needed**

Do not add a modal in MVP unless a user action requires confirmation. If adding save confirmation, use TDS dialog and copy:

```text
취향 도감을 저장했어요
```

Primary action:

```text
확인
```

- [ ] **Step 5: Keep custom components for product-specific cards**

Do not replace `PersonCard` or `GiftRecommendationCard` entirely if TDS card components make the result visually generic. Keep local card layout but use TDS text/button primitives inside when it improves consistency.

- [ ] **Step 6: Run lint and build**

Run:

```bash
pnpm run lint
pnpm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: apply tds mobile components"
```

---

### Task 9: Firebase Persistence Integration

**Files:**

- Modify: `src/app/App.tsx`
- Modify: `src/features/people/peopleService.ts`

- [ ] **Step 1: Add loading and fallback behavior to `App.tsx`**

On mount, call `listPeople()`. If Firebase env vars are missing or loading fails during local development, keep `samplePeople` so the app remains demoable.

Use this pattern:

```tsx
useEffect(() => {
  let isMounted = true;

  listPeople()
    .then((remotePeople) => {
      if (isMounted && remotePeople.length > 0) {
        setPeople(remotePeople);
      }
    })
    .catch(() => {
      if (isMounted) {
        setPeople(samplePeople);
      }
    });

  return () => {
    isMounted = false;
  };
}, []);
```

- [ ] **Step 2: Save created profiles to Firestore**

In `onSave`, create a local person immediately, then call `createPerson(input)`:

```tsx
onSave={(input) => {
  const localPerson = createLocalPerson(input);

  setPeople((currentPeople) => [localPerson, ...currentPeople]);
  setView("people");
  createPerson(input).catch(() => {
    setPeople((currentPeople) => currentPeople);
  });
}}
```

Import:

```ts
import { createPerson, listPeople } from "../features/people/peopleService";
import { useEffect, useState } from "react";
```

- [ ] **Step 3: Avoid committing real Firebase secrets**

Confirm `.gitignore` includes:

```text
.env
.env.local
.env.*.local
```

- [ ] **Step 4: Run lint and build**

Run:

```bash
pnpm run lint
pnpm run build
```

Expected: PASS with placeholder `.env.example`; local runtime only connects after real `.env` values are added.

- [ ] **Step 5: Commit**

```bash
git add .gitignore src/app/App.tsx src/features/people/peopleService.ts
git commit -m "feat: persist people with firebase"
```

---

### Task 10: Apps in Toss Polish and Submission Readiness

**Files:**

- Modify: `src/styles/tokens.css`
- Modify: `src/app/app.css`
- Modify: `src/components/components.css`
- Modify: `README.md`
- Review: `ui-ux-guide/*.md`

- [ ] **Step 1: Review local Toss UX guides**

Read:

```bash
cat ui-ux-guide/mini-app-branding-guide.md
cat ui-ux-guide/resolution.md
cat ui-ux-guide/graphic.md
cat ui-ux-guide/ux-wrighting.md
cat ui-ux-guide/dark-pattern-prevent-policy.md
```

On Windows PowerShell:

```powershell
Get-Content ui-ux-guide\mini-app-branding-guide.md
Get-Content ui-ux-guide\resolution.md
Get-Content ui-ux-guide\graphic.md
Get-Content ui-ux-guide\ux-wrighting.md
Get-Content ui-ux-guide\dark-pattern-prevent-policy.md
```

- [ ] **Step 2: Confirm white-base UI**

Check CSS values:

```bash
rg "#|background|color-scheme|prefers-color-scheme" src
```

Expected:

- Base background remains `#ffffff`.
- No dark-mode override changes the app into a dark base.
- Accent colors are limited to primary CTA and taste tags.

- [ ] **Step 3: Update README**

Add:

````md
# 선물 취향 도감

Apps in Toss 미니앱 챌린지 출품용 React 웹뷰 앱입니다.

## Stack

- Vite
- React
- TypeScript
- TDS Mobile
- Firebase Auth / Firestore
- Vitest

## Commands

```bash
pnpm install
pnpm run dev
pnpm run lint
pnpm run test
pnpm run build
```

## Environment

Copy `.env.example` to `.env` and fill Firebase web app values.
````

- [ ] **Step 4: Run full verification**

Run:

```bash
pnpm run lint
pnpm run test
pnpm run build
```

Expected: all PASS.

- [ ] **Step 5: Manual mobile verification**

Run:

```bash
pnpm run dev
```

Open the dev URL in a mobile-width browser viewport around 390px wide.

Verify:

- First screen is actionable.
- User can create a person.
- User can select that person.
- User can choose a budget.
- Result page shows three recommendation cards.
- Text does not overflow on 360px width.
- Bottom content respects safe area.
- UI remains white-base.

- [ ] **Step 6: Commit**

```bash
git add README.md src
git commit -m "chore: polish apps in toss submission"
```

---

## Final Verification Checklist

- [ ] `pnpm run lint` passes.
- [ ] `pnpm run test` passes.
- [ ] `pnpm run build` passes.
- [ ] TDS Mobile is installed and used for primary controls.
- [ ] Firebase config uses environment variables only.
- [ ] No real Firebase secrets are committed.
- [ ] User can complete the MVP flow in under one minute.
- [ ] UI uses white as the base surface.
- [ ] Copy is Korean, casual, clear, and positive.
- [ ] No dark-pattern interactions are introduced.
- [ ] `AGENTS.md` and `PLAN.md` match the current implementation direction.
