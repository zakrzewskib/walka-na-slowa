export interface ILetter {
  value: string;
  exists: boolean;
  correctPlace: boolean;
}

export type IWord = ILetter[];
