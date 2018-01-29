export enum TagStyle {
  Success = 'success',
  Error = 'error'
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