import React, { Component } from 'react';
import './App.css';

//you can use template literals¹³² for string concatenation or interpolation. You will use it to concatenate your URL for the API endpoint.

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';


//const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

// the following code is same as the

// function isSearched(seacrhTerm){
//   return function (item)
//   {
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }

//const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());




class Button extends Component {
  render() {
    const {
      onClick,
      className = '',
      children,
    } = this.props;
    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    );
  }
}

// This is a react class component but since this does not need access to any life cycle method and does not need to
// // access the state this can be modified to a stateless function component
// class Search extends Component {
//   render() {
//     const { value, onChange, children } = this.props;
//     return (
//       <form>
//         {children} <input
//           type="text"
//           value={value}
//           onChange={onChange}
//         />
//       </form>
//     );
//   }
// }

// This is the function with destructuring in the body

// function Search(props) {
//   const { value, onChange, children } = props;
//   return (
//     <form>
//       {children} <input
//         type="text"
//         value={value}
//         onChange={onChange}
//       />
//     </form>
//   );
// }

// This is the function with destructuring is in the declaration


// function Search({ value, onChange, children }) {
//   return (
//     <form>
//       {children} <input
//         type="text"
//         value={value}
//         onChange={onChange}
//       />
//     </form>
//   );
// }

// Simplified with arrow notation.


const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

// As class component

// class Table extends Component {
//   render() {
//     const { list, pattern, onDismiss } = this.props;
//     return (
//       <div>
//         {list.filter(isSearched(pattern)).map(item =>
//           <div key={item.objectID} className="table-row">
//             <span>
//               <a href={item.url}>{item.title}</a>
//             </span>
//             <span>{item.author}</span>
//             <span>{item.num_comments}</span>
//             <span>{item.points}</span>
//             <span>
//               <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
//                 Dismiss
//               </Button>
//             </span>
//           </div>
//         )}
//       </div>
//     );
//   }
// }
/*
const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {list.filter(isSearched(pattern)).map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>
          {item.author}
        </span>
        <span style={{ width: '10%' }}>
          {item.num_comments}
        </span>
        <span style={{ width: '10%' }}>
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>
*/

const Table = ({ list, onDismiss }) =>
  <div className="table">
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>
          {item.author}
        </span>
        <span style={{ width: '10%' }}>
          {item.num_comments}
        </span>
        <span style={{ width: '10%' }}>
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  // onDismiss(id) {
  //   const isNotId = item => item.objectID !== id;
  //   const updatedList = this.state.list.filter(isNotId);
  // }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      /*
      This is called a "spread operator" shown with three dots: ... When it is used, every value from an array or object gets copied to another array or object
          const userNames = { firstname: 'Robin', lastname: 'Wieruch' };
          const age = 28;
          const user = { ...userNames, age };
          console.log(user);
          output: { firstname: 'Robin', lastname: 'Wieruch', age: 28 }
      */


      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange(event) {
    this.setState(
      { searchTerm: event.target.value }
    )
  }


  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }



  render() {
    //this is called destructuring which es essentially defining to variables
    // searchTerm = this.state.searchTerm
    // list = this.state.list
    // which makes is easier to use them later on
    const { searchTerm, result } = this.state;


    // In the initial call the result is not present since the call is made asynchronously
    // if (!result) { return null; }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
        </Search>
        </div>
        { result
          ? <Table
            list={result.hits}
            //   pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
          : null
        }
      </div>
    );
  }



  // This is the APP before splitting into components

  // render() {
  //   //this is called destructuring which es essentially defining to variables
  //   // searchTerm = this.state.searchTerm
  //   // list = this.state.list
  //   // which makes is easier to use them later on
  //   const { searchTerm, list } = this.state;
  //   return (
  //     <div className="App">
  //       <form>
  //         <input type="text" value = {searchTerm} onChange={this.onSearchChange} />
  //       </form>
  //       {list.filter(isSearched(searchTerm)).map(item =>
  //         <div key={item.objectID}>
  //           <span>
  //             <a href={item.url}>{item.title}</a>
  //           </span>
  //           <span>{item.author}</span>
  //           <span>{item.num_comments}</span>
  //           <span>{item.points}</span>
  //           <span>
  //             <button
  //               onClick={() => this.onDismiss(item.objectID)}
  //               type="button"
  //             >
  //               Dismiss
  //             </button>
  //           </span>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }
}
export default App;