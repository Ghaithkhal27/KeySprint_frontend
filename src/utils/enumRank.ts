




enum RankTier {
    BRONZE = "BRONZE",
    SILVER = "SILVER",
    GOLD = "GOLD",
    PLATINUM = "PLATINUM",
    DIAMOND = "DIAMOND",
    MASTER = "MASTER",
    GRANDMASTER = "GRANDMASTER",
  }


  export const enumRank = (wpm: number): RankTier => {
    if (wpm < 20 ) return RankTier.BRONZE;
    if (wpm < 40 ) return RankTier.SILVER;
    if (wpm < 60 ) return RankTier.GOLD;
    if (wpm < 80 ) return RankTier.PLATINUM;
    if (wpm < 100 ) return RankTier.DIAMOND;
    if (wpm < 120 ) return RankTier.MASTER;
    return RankTier.GRANDMASTER;
  }