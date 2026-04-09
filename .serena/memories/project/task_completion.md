# Task Completion Checklist

After completing any task in this project:

1. **Run linting**: `npm run lint`
   - Fix any ESLint errors before considering the task complete
   
2. **Run typecheck**: Not explicitly configured, but verify no TypeScript errors with `npm run build`

3. **Test the changes**: 
   - Run `npm run dev` and verify the feature works
   - If a build feature, verify `npm run build` succeeds

4. **Verify no console errors**: Check browser console for runtime errors

5. **Test localStorage persistence**: If modifying game state, verify saves persist across page reload