export interface Enhancement {
  id: string;
  start: () => void;
  stop: () => void;
}
