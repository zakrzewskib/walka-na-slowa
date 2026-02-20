export interface ILetter {
  value: string;
  exists: boolean;
  correctPlace: boolean;
}

export interface IWord {
  id: string;
  letters: ILetter[];
}

export type IGuessResult = ILetter[];
