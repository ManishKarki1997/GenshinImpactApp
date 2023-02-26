import talentUpgradeCostInfo from "../assets/data/talentUpgradeCostInfo";

const findTalentUpgradeMaterials = (character, talentLevel) => {
  if (!character) return;

  const characterTalentBossMaterial = character.talentMaterial;
  const characterTalentBooks = character.talentBook;

  const talentUpgradeRawData = talentUpgradeCostInfo[talentLevel];

  const talentUpgradeDetailedCostInfo = talentUpgradeRawData.map((data) => {
    if (data.type === "Mora") {
      return {
        ...data,
        name: "Mora",
        description: "",
        iconUrl:
          "https://res.cloudinary.com/dnoibyqq2/image/upload/v1620827585/genshin-app/other-items/mora.png",
      };
    } else if (data.type === "TALENT_BOOK") {
      return {
        ...data,
        ...characterTalentBooks.find((x) => x.rarity === data.rarity),
      };
    } else if (data.type === "CROWN_OF_INSIGHT") {
      return {
        ...data,
        name: "Crown of Insight",
        iconUrl:
          "https://res.cloudinary.com/dnoibyqq2/image/upload/v1620824559/genshin-app/talent-boss-items/crown-of-insight.png",
      };
    } else if (data.type === "BOSS_TALENT_MATERIAL") {
      return {
        ...data,
        ...characterTalentBossMaterial[0],
      };
    }
  });

  const idx = Object.keys(talentUpgradeCostInfo).findIndex(
    (x) => x == talentLevel
  );
  let totalCumulativeMora = 0;

  for (let i = 0; i <= idx; i++) {
    totalCumulativeMora += talentUpgradeCostInfo[
      Object.keys(talentUpgradeCostInfo)[i]
    ].find((x) => x.type === "Mora").count;
  }

  const newItemWithTotalMoraRequired = {
    count: totalCumulativeMora,
    name: "Total until Level " + talentLevel,
    description: "",
    iconUrl:
      "https://res.cloudinary.com/dnoibyqq2/image/upload/v1620827585/genshin-app/other-items/mora.png",
  };

  talentUpgradeDetailedCostInfo.push(newItemWithTotalMoraRequired);

  return talentUpgradeDetailedCostInfo;
};

export default findTalentUpgradeMaterials;
