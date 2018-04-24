import React, { Component } from 'react';
import './index.css';

class EmptyColumn extends Component {
  render() {
    return (
      <section className="EmptyColumn">
        <h3>Add new column</h3>

        <ul>
          <li>
            <a href="">Ads from a category</a>
          </li>
          <li>
            <a href="">Ads from an user</a>
          </li>
          <li>
            <a href="">My ads</a>
          </li>
          <li>
            <a href="">Black list</a>
          </li>
        </ul>
        
      </section>
    );
  }
}

export default EmptyColumn;
