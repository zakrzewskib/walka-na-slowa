export interface ILetter {
  id: string;
  value: string;
  exists: boolean;
  correctPlace: boolean;
}

export interface IWord {
  id: string;
  letters: ILetter[];
}
