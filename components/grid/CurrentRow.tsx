import { Cell } from "./Cell";

type Props = {
  guess: string;
  wordLength: number;
};

export const CurrentRow = ({ guess, wordLength }: Props) => {
  const splitGuess = guess.split("");
  const emptyCells = Array.from(
    Array(Math.max(wordLength - splitGuess.length, 0))
  );

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
};
