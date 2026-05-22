# AGENTS.md

## Task Management Rule

- If there is a new task or follow-up work to do, create a new sequential folder under `docs/tasks`.
- Folder names must use the format `task_0001`, `task_0002`, `task_0003`, and so on.
- Inside each task folder, create a `task.md` file describing the work to be done.
- Always use the next available sequence number and do not reuse existing task folder numbers.
- Keep `docs/tasks/tasks.md` updated whenever a task is added or a task completion status changes.
- `docs/tasks/tasks.md` must include a short description and completion status for each task.

## Task Documentation Rule

- All task-related documentation files must be written in Korean.
- All task-related documentation files must be created inside the corresponding task folder under `docs/tasks`.
- When the user requests analysis, such as code analysis, root-cause analysis, or research, document the analysis in `reference.md` inside the corresponding task folder.
- When the user gives an actual code planning command, write the implementation plan in `plan.md` inside the corresponding task folder.
- When actual code is implemented, document the implementation details in `implementation.md` inside the corresponding task folder.
- When code changes are refactored, document the refactoring details in `refactor.md` inside the corresponding task folder.
- When tests are performed, document the test details and results in `test.md` inside the corresponding task folder.
- When the user gives a review command, document the review findings in `review.md` inside the corresponding task folder.

## Task Document Quality Rule

- `reference.md` must include the analysis purpose, inspected files or sources, key findings, root cause or research conclusion, risks, and recommended next steps.
- `plan.md` must include the implementation goal, scope, affected files or modules, step-by-step execution plan, validation method, and rollback or risk notes when relevant.
- `implementation.md` must include the changed files, main implementation details, important decisions, user-visible behavior changes, and any limitations or follow-up work.
- `refactor.md` must include the refactoring goal, changed structure, behavior-preservation notes, affected files, risk areas, and verification results.
- `test.md` must include the test purpose, executed commands or manual test steps, environment assumptions, results, failures, and remaining test gaps.
- `review.md` must prioritize findings by severity and include file references, issue descriptions, impact, suggested fixes, and open questions.

## Code Implementation Rule

- During code implementation, include helpful explanatory comments in the implemented code.
- Every actual code implementation task must add at least one concise explanatory code comment in the changed implementation code, unless the user explicitly requests no comments.
- The comment must explain intent, boundary, decision reason, or non-obvious behavior, not merely repeat what the code says.
- Keep code comments concise and avoid excessive verbosity.
- Do not add comments that merely restate obvious code behavior.
