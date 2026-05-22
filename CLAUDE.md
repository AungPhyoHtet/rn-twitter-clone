# Claude Code Instructions

## Commit Style

- No `Co-Authored-By` line in commit messages
- Short, direct message only (e.g. `feat: add infinite scroll and pull-to-refresh to profile screen`)

## UX Patterns

### Auth Form Error Handling

- On failed login: clear only the password field, keep email pre-filled
- Never clear inputs on field-specific validation errors — let the user correct in place
- Show per-field errors directly below each input using the API `errors` object
- Pass an `onError` callback to the `login` function to handle UI side effects (e.g. `login(email, password, () => setPassword(''))`)
- Use `useFocusEffect` + `useCallback` to clear errors when a screen gains focus — not `useEffect`, because stack navigator screens stay mounted and never unmount when navigating forward

### TypeScript

- Use `Record<string, string[]>` for API validation error objects
- Disable base `no-unused-vars` rule and use `@typescript-eslint/no-unused-vars` with `argsIgnorePattern: '^_'` for proper TS support
- Combine related local state into one object (e.g. `fieldErrors: { email: '', password: '' }`) to reduce variable declarations
- When you need to set state AND check the new value in the same function, compute it in a plain variable first — React state updates are async so the state variable won't reflect the new value immediately
