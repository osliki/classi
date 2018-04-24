import React, { Component } from 'react';
import './index.css';
import PropTypes from 'prop-types';

class Column extends Component {
  static propTypes = {
    category: PropTypes.number,
    user: PropTypes.string
  }

  static contextTypes = {
    contract: PropTypes.object
  }

  render() {
    let {category, user} = this.props;

    console.dir(this.context.contract);

    return (
      <section className="Column">
    sdsd
      </section>
    );
  }
}

export default Column;
