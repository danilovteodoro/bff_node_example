
function fn(...args: unknown[]): string {
  const prfefix = `test`
  let key: string = prfefix
  if(args.length > 0) {
    key += `:${args.join('-')}`
  }
  return key
}
function getStaleKey(...args: unknown[]): string {
  return fn(args).concat(':stale')
}
console.log(getStaleKey(1))
console.log(getStaleKey('teste'))
console.log(getStaleKey(1,2))
console.log(getStaleKey())
