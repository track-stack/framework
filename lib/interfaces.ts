export enum TagStyle {
  Success = 'success',
  Error = 'error',
  Input = 'input',
  None = ''
}

export interface Tag {
  tag: string,
  range: [number, number],
  style?: TagStyle 
}

export interface AttributedString {
  key: string,
  options: {indent?: number, tags?: Tag[]}
}