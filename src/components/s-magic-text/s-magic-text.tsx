import { Component, Host, h, ComponentInterface } from '@stencil/core';

@Component({
  tag: 's-magic-text',
  styleUrl: 's-magic-text.css',
  shadow: true,
})
export class SMagicText implements ComponentInterface {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
