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
    baseMax: 30000,
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
        id: template.title.split(" ").join("-"),
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
