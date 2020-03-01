import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import 'bulma/css/bulma.css';

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// check if ordered list is the correct list
const areArraysEqual = (a, b) => {
    if (a.length === 0 || b.length === 0) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }
    return a.every( (item, i) => item.id === b[i].id);
}

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // change background colour if dragging
  background: isDragging ? "darkgrey" : "lightgrey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  padding: grid
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: getItems(3),
      correctItems: getItems(3).reverse(),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.checkIfCorrect = this.checkIfCorrect.bind(this);

  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.checkIfCorrect(items)

    this.setState({
      items
    });
    
  }

  checkIfCorrect(itemsOrder) {
      areArraysEqual(itemsOrder, this.state.correctItems)
      if (areArraysEqual(itemsOrder, this.state.correctItems)) {
          alert("Correct")
      }
  }

  render() {
    return (
        <div className="columns">
            <div className="column is-three-fifths is-offset-one-fifth">

                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        >
                        {this.state.items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                                <div className="box card"                                
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                )}
                        >         
                                    <div className="card-header">
                                        <div className="card-header-title">The Godfather</div>
                                    </div>
                                    <div className="card-image" >
                                        <figure className="image">
                                            <img style={{width: 300}} alt={"Poster for " + item.content} className="image" src="https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg%22,%22" />
                                        </figure>
                                    </div>
                                    {/* <div className="card-content">
                                        <div className="media">
                                        <iframe width="560" height="315" src="https://www.youtube.com/embed/sY1S34973zA" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="some title"></iframe>                                        </div>
                                    </div> */}
                                </div>
                            )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                        </div>
                    )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
  }
}

// Put the thing into the DOM!
ReactDOM.render(<App />, document.getElementById("root"));
