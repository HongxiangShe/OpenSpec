## ADDED Requirements
### Requirement: Language Preference Awareness
`openspec/AGENTS.md` SHALL detect the configured language preference and ensure AI-facing instructions, summaries, and validation tips adopt that language so assistants consistently respond in the expected dialect.

#### Scenario: Communicating in the configured language
- **WHEN** `language.preferred` is set to `zh-CN`
- **AND** `openspec/AGENTS.md` is regenerated
- **THEN** translate section headings, quick-reference blurbs, and inline guidance into Simplified Chinese (while retaining code keywords in English when necessary)
- **AND** explicitly remind assistants to reply in Chinese for future interactions

#### Scenario: Documenting fallbacks and overrides
- **WHEN** no language has been configured or the user overrides it via environment/context
- **THEN** keep the document in English but include a note explaining how to set `language.preferred` so teams can opt into localized content
- **AND** mention the active language near the top of the file so teammates know why the instructions may appear in English or Chinese
