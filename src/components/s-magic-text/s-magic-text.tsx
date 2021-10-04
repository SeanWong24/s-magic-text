import { Component, Event, EventEmitter, Host, h, ComponentInterface, Prop, State, Method } from '@stencil/core';

@Component({
  tag: 's-magic-text',
  styleUrl: 's-magic-text.css',
  shadow: true,
})
export class SMagicText implements ComponentInterface {

  @State() segments: Segment[];

  @Prop() text: string;
  @Prop() tags: Tag[];
  @Prop() shouldReplaceTextWithTag = false;
  @Prop() segmentSplitRegExp = /([^\w\'])/g;
  @Prop() segmentStyle: Partial<CSSStyleDeclaration> = { cursor: 'pointer', userSelect: 'none' };
  @Prop() segmentHoverStyle: Partial<CSSStyleDeclaration> = { backgroundColor: 'orange' };
  @Prop() labelStyle: Partial<CSSStyleDeclaration> = { borderRadius: '.5em', backgroundColor: 'bisque' };

  @Event() segmentClick: EventEmitter<Segment & { innerEvent: MouseEvent }>;
  @Event() segmentContextMenu: EventEmitter<Segment & { innerEvent: MouseEvent }>;

  componentWillRender() {
    const textSegmentsWithSpaces = this.text
      .split(this.segmentSplitRegExp)
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
        segment.tag = highlight;
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
                title={this.shouldReplaceTextWithTag ? segment.text : segment?.tag?.name}
                style={{ ...this.segmentStyle, ...(segment?.tag?.style) } as any}
                onMouseOver={event => this.setStyle(event.currentTarget as HTMLElement, { ...this.segmentStyle, ...this.segmentHoverStyle, ...(segment?.tag?.style), ...(segment?.tag?.hoverStyle) })}
                onMouseOut={event => this.setStyle(event.currentTarget as HTMLElement, { ...this.segmentStyle, ...(segment?.tag?.style) })}
                onClick={event => this.segmentClick.emit({ ...segment, innerEvent: event })}
                onContextMenu={event => this.segmentClick.emit({ ...segment, innerEvent: event })}
              >
                {this.shouldReplaceTextWithTag ? (segment.tag?.name || segment.text) : segment.text}
                {
                  segment.tag?.label &&
                  <span style={{ ...this.labelStyle, ...(segment?.tag?.labelStyle) } as any}>{segment.tag.label}</span>
                }
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
  label?: string;
  style?: Partial<CSSStyleDeclaration>;
  hoverStyle?: Partial<CSSStyleDeclaration>;
  labelStyle?: Partial<CSSStyleDeclaration>;
}

export interface Segment {
  start: number;
  end: number;
  text: string;
  tag?: Tag;
}
