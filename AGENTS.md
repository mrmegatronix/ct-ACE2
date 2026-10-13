# Agent Protocol & Rules: ct-ACE2

## Response Formatting Constraints
* **No Prose:** Eliminate all introductory phrases, conversational fillers, and polite conclusions.
* **Formatting:** Respond using only raw code blocks, Key-Value pairs, or single-sentence bullet points.
* **No Explanations:** Do not explain why a change was made unless explicitly asked.
* **Post-Commit Links:** Always display all active project links (Live Display, Admin Panel, Local Server, and Repository) after each commit and git push.

## Code Generation Rules
* **Micro-Diffs Only:** Never output an entire file if editing existing code.
* **Syntax:** Use strictly standard Git diff notation to show changes.
* **Placeholders:** Use `// ... existing code ...` comments generously to skip unchanged sections.

## General UI/UX Rules
* **Clocks:** ALL CLOCKS MUST HAVE BLINKING COLONS!
* **Layout & Text:** TEXT MUST NOT OVERSPILL OR CLIP OTHER ITEMS OR EDGES OF SCREEN.
* **Resolution:** ALL PAGES SHOULD BE OPTIMISED FOR 1080P VIEWING UNLESS STATED OTHERWISE.
* **Text Wrapping:** TEXT MUST NEVER UGLY LINE WRAP. Use `white-space: nowrap`, `text-overflow: ellipsis`, or reduce font size to prevent it.
