import WeaponAscensionProgressionStat from "../assets/data/weaponAscensionProgressionStat";

const findWeaponUpgradeInfo = (weapon, level) => {
  const weaponAscensionMaterials = weapon.ascensionMaterials;

  const wepaonAscensionStatInfo = WeaponAscensionProgressionStat[level];

  const weaponUpgradeInfo = wepaonAscensionStatInfo.map((x) => {
    if (x.type === "Mora") {
      return {
        ...x,
        name: "Mora",
        description: "",
        iconUrl:
          "https://res.cloudinary.com/dnoibyqq2/image/upload/v1620827585/genshin-app/other-items/mora.png",
      };
    } else if (x.type === "ELITE_ENEMY_MATERIAL") {
      return {
        ...x,
        ...weapon.ascensionEnemyDrops.find(
          (y) => y.rarity === x.rarity && x.type === y.type
        ),
      };
    } else if (x.type === "WEAPON_ASCENSION_BOSS_MATERIAL") {
      return {
        ...x,
        ...weaponAscensionMaterials.find((y) => y.rarity === x.rarity),
      };
    } else if (x.type === "COMMON_ENEMY_MATERIAL") {
      return {
        ...x,
        ...weapon.ascensionEnemyDrops.find(
          (y) => y.type === x.type && y.rarity === x.rarity
        ),
      };
    }
  });

  const idx = Object.keys(WeaponAscensionProgressionStat).findIndex(
    (x) => x == level
  );

  let totalCumulativeMora = 0;
  for (let i = 0; i <= idx; i++) {
    totalCumulativeMora += WeaponAscensionProgressionStat[
      Object.keys(WeaponAscensionProgressionStat)[i]
    ].find((x) => x.type === "Mora").count;
  }

  weaponUpgradeInfo.push({
    count: totalCumulativeMora,
    name: "Total until level " + level,
    description: "",
    iconUrl:
      "https://res.cloudinary.com/dnoibyqq2/image/upload/v1620827585/genshin-app/other-items/mora.png",
  });

  return weaponUpgradeInfo;
};

export default findWeaponUpgradeInfo;
