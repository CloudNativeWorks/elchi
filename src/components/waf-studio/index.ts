/**
 * WAF Studio — shared SecLang/Coraza authoring surface.
 *
 * These components are the reusable core behind both the WASM-WAF editor
 * (`src/pages/waf`) and the Shield Coraza "WAF Studio" (`src/pages/shield`).
 * They live under the WAF page (the canonical home of the CRS API + types) and
 * are re-exported here as the single, stable import point so neither feature
 * has to reach into the other's internals.
 *
 * Everything exported here is callback-driven — no page store coupling — so a
 * host wires its own state (a WAF directive set, or Shield's `CorazaSpec`
 * directives blob) via props.
 */

export { default as CrsLibraryPane } from '@/pages/waf/components/crs-library/CrsLibraryPane';
export type {
    CrsLibraryPaneProps,
    CrsAddTarget,
} from '@/pages/waf/components/crs-library/CrsLibraryPane';
export { useCrsLibrary, PHASE_LABEL } from '@/pages/waf/components/crs-library/useCrsLibrary';

export { default as DirectiveRow } from '@/pages/waf/components/editor/DirectiveRow';
export { default as AddDirectiveBar } from '@/pages/waf/components/editor/AddDirectiveBar';

export { default as TemplateBuilderDrawer } from '@/pages/waf/components/TemplateBuilderDrawer';
export type { TemplateBuilderDrawerProps } from '@/pages/waf/components/TemplateBuilderDrawer';

export { default as VisualRuleBuilder } from './VisualRuleBuilder';
export type { VisualRuleBuilderProps } from './VisualRuleBuilder';

export { lintDirectives } from '@/pages/waf/utils/clientLint';
export {
    renderHighlightedDirective,
    tokenizeDirective,
} from '@/pages/waf/utils/directiveSyntaxHighlight';

export type {
    Directive,
    CrsRule,
    CrsRuleCharacteristics,
    CrsRuleDescription,
    LintResult,
    LintDiagnostic,
    LintSeverity,
} from '@/pages/waf/types';
