import * as React from 'react';
import './ExampleCard.scss';
import { default as Button, ButtonType } from '../../../components/Button';

let Highlight = require('react-highlight');

export interface IExampleCardProps {
  title: string;
  code?: string;
  children?: any;
}

export interface IExampleCardState {
  isCodeVisible: boolean;
}

export default class ExampleCard extends React.Component<IExampleCardProps, IExampleCardState> {

  constructor() {
    super();

    this.state = {
      isCodeVisible: false
    };

    this._onToggleCodeClick = this._onToggleCodeClick.bind(this);
  }

  public render() {
    const { title, code, children } = this.props;
    const { isCodeVisible } = this.state;
    let rootClass = 'ExampleCard' + (this.state.isCodeVisible ? ' is-codeVisible' : '');
    let codeExample;

    if (code) {
      codeExample = (
        <div className='ExampleCard-code'>
          <Highlight className='typescript'>
            { code }
          </Highlight>
        </div>
      );
    }

    return (
      <div className={ rootClass }>
        <div className='ExampleCard-header'>
          <span className='ExampleCard-title ms-font-l'>{ title }</span>
          { (code ? (
          <span className='ExampleCard-toggleCode ms-font-l'>
            <Button type={ ButtonType.primary } onClick={ this._onToggleCodeClick }>{ isCodeVisible ? 'Hide code' : 'Show code' }</Button>
          </span>
          ) : null) }
        </div>
        <div className={ 'ExampleCard-content' + (isCodeVisible ? ' ms-u-slideDownIn20' : '') }>
          { codeExample }
          <div className='ExampleCard-example'>
            { children }
          </div>
        </div>
      </div>
    );
  }

  private _onToggleCodeClick() {
    this.setState({
      isCodeVisible: !this.state.isCodeVisible
    });
  }
}