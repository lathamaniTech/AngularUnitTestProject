export const DynamicCardsConfiguration = (
  countCardsList?: DynamicCardsData[]
): DynamicCardsData[] => {
  if (countCardsList) {
    return countCardsList;
  } else {
    return [
      { title: "Total Proposals", value: 700 },
      { title: "On Process", value: 230 },
      { title: "Sanctioned", value: 300 },
      { title: "Rejected", value: 254 },
      { title: "Opened prending for > 30 days", value: 143 },
      { title: "Disbursed", value: 120 },
    ];
  }
};

export interface DynamicCardsData {
  title: string;
  value: string | number | null;
  className?: string;
}
