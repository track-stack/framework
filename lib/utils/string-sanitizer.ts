/*jshint esversion: 6 */

export function sanitize(input: string): string {
  input = input.toLowerCase()

  const blacklist = "a|an|and|the|in|by"
  const articlePattern = `\\b(${blacklist})\\b`

  const Patterns = {
    parensAndBrackets: /[\(\)\[\]]/g,
    hyphensAndUnderscores: /[-_]/g,
    punctuation: /[.'!&]/g,
    articles: new RegExp(articlePattern, 'g'),
    whitespace: /\s+/g
  }

  // remove all puncuation and replace them with ""
  input = input.replace(Patterns.punctuation, '')

  // many times, featured results, or additional producers are appended
  // to the result like so: (featuring beep and boop...)
  input = input.replace(Patterns.parensAndBrackets, '')

  // remove all - or _ and replace them with " "
  input = input.replace(Patterns.hyphensAndUnderscores, ' ')

  // remove all blacklisted articles
  input = input.replace(Patterns.articles, '')

  // replace multiple spaces with a single space
  input = input.replace(Patterns.whitespace, ' ')

  return input.trim()
}
