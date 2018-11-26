import React from 'react';

// Props are mounted with the component
const ListItem = (props) => {
    return <li className="list-group-item">
    {/* Updates the task with the specified name */}
    <button 
       onClick={props.editTask}
       className="btn-sm btn mr-4 btn-info"
    >
       U
    </button>
    {/* The name of the list item */}
    {props.item.name}
    {/* Deletes the specific task */}
    <button 
       onClick={props.deleteTask}
       className="btn-sm btn ml-4 btn-danger"
    >
       X
    </button>
 </li>;
}

export default ListItem;