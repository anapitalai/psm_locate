---
name: push-after-feature
description: 'Use when implementing features, adding functionality, fixing app behavior, or changing project files where completed changes must be validated, committed, and pushed to GitHub.'
argument-hint: 'Feature/change summary for the commit message'
---

# Push After Feature

## Outcome

After a feature or code change is completed, the workspace is left with the intended changes committed locally and pushed to the configured GitHub remote branch.

## When to Use

Use this workflow automatically after:

- Adding a feature or app functionality
- Editing project files for a requested change
- Fixing behavior that should be preserved in version control
- Preparing static-site updates for GitHub Pages deployment

The user should not need to explicitly ask for a push after code changes. If a requested change modifies files, complete this workflow unless the user explicitly says not to push.

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
- **Unrelated changes present**: do not stage them; ask if unsure.
- **No Git remote configured**: report the blocker and ask for the GitHub remote URL.
- **Push rejected**: fetch/rebase or merge only after reviewing the situation; never overwrite remote history by default.
- **Sensitive prompt appears**: the user must enter secrets directly into the terminal.

## Completion Criteria

The workflow is complete only when:

- The requested feature/change is present in the workspace.
- Relevant validation has passed or any limitation is clearly reported.
- Intended changes are committed.
- The commit is pushed to GitHub.
- The final response includes enough details for the user to verify the push.
