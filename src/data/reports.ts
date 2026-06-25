export type Report = {
  month: string;
  uses: number;
  rate: number;
};

export const REPORTS: Report[] = [
  { month: '2025年04月分', uses: 20, rate: 98 },
  { month: '2025年03月分', uses: 20, rate: 98 },
  { month: '2025年02月分', uses: 18, rate: 94 },
  { month: '2025年01月分', uses: 22, rate: 91 },
];
