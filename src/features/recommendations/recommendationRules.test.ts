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
