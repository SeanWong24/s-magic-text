import { Component, Event, EventEmitter, Host, h, ComponentInterface, Prop, State, Method } from '@stencil/core';

@Component({
  tag: 's-magic-text',
  styleUrl: 's-magic-text.css',
  shadow: true,
})
export class SMagicText implements ComponentInterface {

  @Prop() text: string;
  @Prop() tags: Tag[];
  @Prop() shouldReplaceTextWithTag = false;
  @Prop() segmentStyle: Partial<CSSStyleDeclaration> = { cursor: 'pointer', userSelect: 'none' };
  @Prop() segmentHoverStyle: Partial<CSSStyleDeclaration> = { backgroundColor: 'orange' };


  @State() segments: Segment[];

  @Event() segmentClick: EventEmitter<Segment & { innerEvent: MouseEvent }>;
  @Event() segmentContextMenu: EventEmitter<Segment & { innerEvent: MouseEvent }>;

  componentWillRender() {
    const textSegmentsWithSpaces = this.text
      .split(/([^\w])/g)
      .filter(Boolean);
    const segments: Segment[] = [];
    let textLength = 0;
    let previousHighlight: Tag;
    textSegmentsWithSpaces.forEach(textSegment => {
      const highlight = this.tags?.find(highlight => highlight.start <= textLength && highlight.end >= (textLength + textSegment.length));
      let segment: Segment;
      if (highlight) {
        segment = (highlight === previousHighlight) ? segments.pop() : { text: '', start: textLength, end: textLength };
        segment.text += textSegment;
        segment.highlightDefinition = highlight;
        previousHighlight = highlight;
      } else {
        segment = { text: textSegment, start: textLength, end: textLength };
      }
      textLength += textSegment.length;
      segment.end = textLength;
      segments.push(segment);
    });
    this.segments = segments;
  }

  @Method()
  async getSegments() {
    return this.segments;
  }

  render() {
    return (
      <Host>
        <div id="main-container">
          {
            this.segments?.map(segment => (
              <span
                title={this.shouldReplaceTextWithTag ? segment.text : segment?.highlightDefinition?.name}
                style={{ ...this.segmentStyle, ...(segment?.highlightDefinition?.style) } as any}
                onMouseOver={event => this.setStyle(event.currentTarget as HTMLElement, { ...this.segmentStyle, ...this.segmentHoverStyle, ...(segment?.highlightDefinition?.style), ...(segment?.highlightDefinition?.hoverStyle) })}
                onMouseOut={event => this.setStyle(event.currentTarget as HTMLElement, { ...this.segmentStyle, ...(segment?.highlightDefinition?.style) })}
                onClick={event => this.segmentClick.emit({ ...segment, innerEvent: event })}
                onContextMenu={event => this.segmentClick.emit({ ...segment, innerEvent: event })}
              >
                {this.shouldReplaceTextWithTag ? (segment.highlightDefinition?.name || segment.text) : segment.text}
              </span>
            ))
          }
        </div>
      </Host>
    );
  }

  private setStyle(element: HTMLElement, styleObject: Partial<CSSStyleDeclaration>) {
    element.style.cssText = '';
    Object.assign(element.style, styleObject);
  }

}

export interface Tag {
  start: number;
  end: number;
  name: string;
  style?: Partial<CSSStyleDeclaration>;
  hoverStyle?: Partial<CSSStyleDeclaration>;
}

export interface Segment {
  start: number;
  end: number;
  text: string;
  highlightDefinition?: Tag;
}
