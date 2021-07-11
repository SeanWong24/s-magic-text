/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { HighlightDefinition, Segment } from "./components/s-magic-text/s-magic-text";
export namespace Components {
    interface SMagicText {
        "getSegments": () => Promise<Segment[]>;
        "highlights": HighlightDefinition[];
        "segmentHoverStyle": Partial<CSSStyleDeclaration>;
        "segmentStyle": Partial<CSSStyleDeclaration>;
        "text": string;
    }
}
declare global {
    interface HTMLSMagicTextElement extends Components.SMagicText, HTMLStencilElement {
    }
    var HTMLSMagicTextElement: {
        prototype: HTMLSMagicTextElement;
        new (): HTMLSMagicTextElement;
    };
    interface HTMLElementTagNameMap {
        "s-magic-text": HTMLSMagicTextElement;
    }
}
declare namespace LocalJSX {
    interface SMagicText {
        "highlights"?: HighlightDefinition[];
        "onSegmentClick"?: (event: CustomEvent<Segment & { textContainer: HTMLElement }>) => void;
        "segmentHoverStyle"?: Partial<CSSStyleDeclaration>;
        "segmentStyle"?: Partial<CSSStyleDeclaration>;
        "text"?: string;
    }
    interface IntrinsicElements {
        "s-magic-text": SMagicText;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "s-magic-text": LocalJSX.SMagicText & JSXBase.HTMLAttributes<HTMLSMagicTextElement>;
        }
    }
}
