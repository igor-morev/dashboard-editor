type SpaceValue =
  | 2
  | 4
  | 6
  | 8
  | 10
  | 12
  | 14
  | 16
  | 20
  | 24
  | 28
  | 32
  | {
      unit: 'px' | 'rem' | 'em';
      value: number;
    };

export type Spaces =
  | {
      x: SpaceValue;
      y: SpaceValue;
    }
  | {
      left: SpaceValue;
      right: SpaceValue;
      top: SpaceValue;
      bottom: SpaceValue;
    };

export type ColorName =
  | 'white'
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'gray'
  | 'purple'
  | 'pink'
  | 'indigo'
  | 'teal'
  | 'cyan'
  | 'black';
export type ColorRange = null | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type BackgroundPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';
export type BackgroundRepeat = 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
export type BackgroundSize = 'cover' | 'contain' | 'auto';
