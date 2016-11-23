' use strict ';
import React from 'react';
import { connect } from 'react-redux';
// import Graph from './graphlist';
import Categories from './catData';

@connect((store) => { 
  return {
    catData: store.catData, // need to pass in weekData
  };
})

export default class GraphList extends React.Component {
  componentDidMount() {
    console.log("data from graphlist", this.props.catData); // need to pass in weekData

    //   Item => (props) {
    //     return <option value="1" graph-line-item="">{props.message}</option>;
    //   }

    // TodoList => () {
    //   const todos = ['finish doc', 'submit pr', 'nag dan to review'];
    //   return (
    //     <select>
    //       {todos.map((message) => <Item key={message} message={message} />)}
    //     </select>
    //   );
    // }
  }

  render() {
    return (
      <div >
       <select class="custom-select">
          <option selected>Compare Website</option>
          <option value="1" graph-line-item={this.props.catData[0].domains[0]}> { this.props.catData[0].domains[0] } </option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
        <br/>
        <Categories />

      </div>
    );
  }
}

       

 // <Graph /> 