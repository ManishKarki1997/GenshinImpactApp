import characterAscensionProgressionStat from "../assets/data/characterAscensionProgressionStat";

const findCharacterAscensionMaterialsInfo = (character, ascensionLevel) => {
  if (!character) return;

  const characterSpecialty = character.localSpecialty;

  const characterCommonEnemyAscensionMaterials =
    character.commonAscensionMaterials;

  const characterAscensionGemsMaterials = character.ascensionMaterials;

  const ascensionMaterialsRawData =
    characterAscensionProgressionStat[ascensionLevel];

  const allAscensionMaterials = ascensionMaterialsRawData.map((mat) => {
    if (mat.type === "ASCENSION_GEM") {
      return {
        ...mat,
        ...characterAscensionGemsMaterials.find((x) => x.rarity === mat.rarity),
      };
    } else if (mat.type === "SPECIALTY") {
      return {
        ...mat,
        ...characterSpecialty,
      };
    } else if (mat.type === "COMMON_ENEMY_MATERIAL") {
      return {
        ...mat,
        ...character.commonAscensionMaterials.find(
          (x) => x.rarity == mat.rarity
        ),
      };
    } else if (mat.type === "WORLD_BOSS_MATERIAL") {
      return {
        ...mat,
        ...characterAscensionGemsMaterials.find(
          (x) => x.type === mat.type && x.characters.includes(character._id)
        ),
      };
    } else if (mat.type === "MORA") {
      return {
        ...mat,
        name: "Mora",
        description: "",
        iconUrl:
          "https://res.cloudinary.com/dnoibyqq2/image/upload/v1620827585/genshin-app/other-items/mora.png",
      };
    }
  });

  const idx = Object.keys(characterAscensionProgressionStat).findIndex(
    (x) => x == ascensionLevel
  );
  let totalCumulativeMora = 0;

  for (let i = 0; i <= idx; i++) {
    totalCumulativeMora += characterAscensionProgressionStat[
      Object.keys(characterAscensionProgressionStat)[i]
    ].find((x) => x.type === "MORA").count;
  }

  const newItemWithTotalMoraRequired = {
    count: totalCumulativeMora,
    name: "Total until Level " + ascensionLevel,
    description: "",
    iconUrl:
      "https://res.cloudinary.com/dnoibyqq2/image/upload/v1620827585/genshin-app/other-items/mora.png",
  };

  allAscensionMaterials.push(newItemWithTotalMoraRequired);

  return allAscensionMaterials.filter((x) => x !== undefined);
};

export default findCharacterAscensionMaterialsInfo;
