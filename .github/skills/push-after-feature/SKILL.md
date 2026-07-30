---
name: push-after-feature
description: 'Use only when the user explicitly asks to push completed code, feature, fix, or project-file changes to GitHub after validation and commit.'
argument-hint: 'Feature/change summary for the commit message'
---

# Push After Feature

## Outcome

When the user explicitly asks to push, the completed feature or code change is validated, committed locally, and pushed to the configured GitHub remote branch.

## When to Use

Use this workflow only when the user explicitly asks to push after:

- Adding a feature or app functionality
- Editing project files for a requested change
- Fixing behavior that should be preserved in version control
- Preparing static-site updates for GitHub Pages deployment

Do not push automatically after code changes. If the user requests a code change but does not explicitly ask to push, validate and commit only the intended files, then report that the commit remains local.

Do not use it for purely conversational answers or read-only investigation.

## Procedure

1. **Confirm the intended change is complete**
   - Review the files changed during the task.
   - Ensure no unrelated user changes are accidentally included.
   - If unrelated changes exist, leave them unstaged unless the user explicitly asks to include them.

2. **Validate before committing**
   - Run the project-appropriate checks.
   - For this static AR app, prefer:
     - `node --check app.js`
     - `node --check psm-data.js`
   - If validation fails, fix the issue before committing.
   - If the required tool is unavailable, report that validation could not be completed and continue only if the change can still be reviewed safely.

3. **Inspect Git state**
   - Check the current branch and remote.
   - Confirm the target remote is GitHub when possible.
   - Do not force-push unless the user explicitly requests it.

4. **Commit the completed change**
   - Stage only the intended files.
   - Use a concise imperative commit message, such as `Add temporary test marker` or `Update PSM marker rendering`.
   - If there is nothing to commit, report that the workspace is already clean.

5. **Push to GitHub**
   - Push the current branch to its upstream remote when configured.
   - If no upstream exists, push to the detected branch on `origin`.
   - If authentication asks for a token, password, passphrase, or other secret, stop and ask the user to type it directly in the terminal.

6. **Report completion**
   - Include the branch, remote, commit hash, and validation result.
   - Mention any skipped validation or files intentionally left uncommitted.

## Decision Points

- **Tests/checks fail**: fix first; do not push broken code unless the user explicitly instructs otherwise.
- **User did not explicitly ask to push**: do not push; report that changes are committed locally.
- **Unrelated changes present**: do not stage them; ask if unsure.
- **No Git remote configured**: report the blocker and ask for the GitHub remote URL.
- **Push rejected**: fetch/rebase or merge only after reviewing the situation; never overwrite remote history by default.
- **Sensitive prompt appears**: the user must enter secrets directly into the terminal.

## Completion Criteria

The push workflow is complete only when:

- The requested feature/change is present in the workspace.
- Relevant validation has passed or any limitation is clearly reported.
- Intended changes are committed.
- The user explicitly asked to push.
- The commit is pushed to GitHub.
- The final response includes enough details for the user to verify the push.
