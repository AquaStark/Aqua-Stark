# ADR-XXXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Describe the forces at play, including technological, political, social, and project local. These forces are probably in tension, and should be called out as such. The language in this section is value-neutral. It is simply describing facts.]

## Decision
[Describe our response to these forces. It is stated in full sentences, with active voice. "We will ..."]

## Consequences
[Describe the resulting context, after applying the decision. All consequences should be listed here, not just the "positive" ones. A particular decision may have positive, negative, and neutral consequences, but all of them affect the team and project in the future.]

### Positive
- [List positive consequences]

### Negative
- [List negative consequences or trade-offs]

### Risks
- [List potential risks and mitigation strategies]

## Alternatives Considered
[Describe the alternatives that were considered and why they were not chosen. This section should be comprehensive and include alternatives that were rejected for various reasons.]

## Implementation Notes
[Optional: Describe any implementation details, migration strategies, or other technical notes that are relevant to this decision.]

### Current State
[Describe the current implementation state]

### Next Steps
[Describe immediate next steps for implementation]

### Migration Strategy
[If applicable, describe how to migrate from the current state to the new decision]

## References
[Optional: List any references, documentation, or resources that informed this decision]

---

## Template Usage Guidelines

### When to Create an ADR
- Major architectural decisions that affect multiple components
- Technology stack changes
- Significant design pattern adoptions
- Breaking changes to APIs or interfaces
- Performance or scalability decisions
- Security-related architectural changes

### ADR Numbering
- Use sequential numbering: 0001, 0002, 0003, etc.
- Never reuse numbers, even if an ADR is deprecated
- Use leading zeros for consistent sorting

### Status Definitions
- **Proposed**: Decision is under consideration
- **Accepted**: Decision has been approved and is being implemented
- **Deprecated**: Decision is no longer relevant or has been replaced
- **Superseded**: Decision has been replaced by a newer ADR

### Writing Guidelines
- Be concise but comprehensive
- Focus on the "why" not just the "what"
- Include both positive and negative consequences
- Consider the long-term impact
- Write for future team members who weren't involved in the decision

### Review Process
1. Create ADR with "Proposed" status
2. Review with team and stakeholders
3. Update based on feedback
4. Change status to "Accepted" when approved
5. Update status as implementation progresses
