export type Format = 'pros-cons' | 'comparison' | 'swot';

export interface ProsConsItem {
  optionName: string;
  pros: string[];
  cons: string[];
}

export interface SWOTItem {
  optionName: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ComparisonData {
  items: {
    criterion: string;
    details: {
      optionName: string;
      detail: string;
    }[];
  }[];
}

export interface AnalysisResponse {
  options: string[];
  analysis: ProsConsItem[] | SWOTItem[] | ComparisonData;
}
