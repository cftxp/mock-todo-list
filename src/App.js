import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import loadingGif from './loading.gif';
import ListItem from './ListItem.js';

class App extends Component {
   constructor(){
      super();

      this.state = {
         newTask: 'Wash the dishes',
         editing: false,
         editingIndex: null,
         notification: null,
         // Create an empty array of tasks
         tasks: [],
         // Create a loading state
            // Tells if the loader will be displayed or not
         loading: true
      };

      // Insert the url for the api
      this.apiUrl = 'https://5bfb96accf9d29001345c478.mockapi.io';

      this.handleChange = this.handleChange.bind(this);
      this.addTask = this.addTask.bind(this);
      this.deleteTask = this.deleteTask.bind(this);
      this.editTask = this.editTask.bind(this);
      this.updateTask = this.updateTask.bind(this);
      this.alert = this.alert.bind(this);
   }

   // Asynchronous function to mount database data into the tasks state using axios
   async componentDidMount(){
      // Fetch data from the API
      const response = await axios.get(`${this.apiUrl}/tasks`);
      console.log(response);
      // Then put them in the state
         // Set to time out after a second
            // So the loading gif loads for a second
            // Then shows the list of tasks
      setTimeout(() => {
         this.setState({
            // The state will display them
            tasks: response.data,
            // Set loading to false as soon as the data has loaded
            loading: false
         });
      }, 1000);
   }
   
   handleChange(event){
      this.setState({
         newTask: event.target.value
      });
   }

   async addTask(){
      // Create a task in the API database
         // Take the name of the new task
         // Post it to the api endpoint
            // await forms the response
      // Then apply the task from the database to the state
      const response = await axios.post(`${this.apiUrl}/tasks`, {
         // Name of the task to be created
         name: this.state.newTask
      });

      const list = this.state.tasks;
      // Push to the list the new task created as part of the constant response
      list.push(response.data);

      // Then set the state in the following manner:
         // Negates the need for generateTaskId()
      this.setState({
         tasks: list,
         newTask: ''
      });
      
      this.alert('Task added successfully.');
   }

   async deleteTask(index){
      const list = this.state.tasks;
      // A specific task associated with a delete action
      const task = list[index];

      // Delete from the API the selected task
         // ${this.apiUrl}/tasks/${task.id} is the id of the selected task
      await axios.delete(`${this.apiUrl}/tasks/${task.id}`);
      // Deletes the specific list item
      delete list[index];

      // Displays the new list
      this.setState({ list })
      this.alert('Task deleted successfully.');
   }

   // Allows the user to edit a particular task
   editTask(index){
      const task = this.state.tasks[index];

      this.setState({
         editing: true,
         editingIndex: index,
         newTask: task.name
      })
   }

   async updateTask(){
      const task = this.state.tasks[this.state.editingIndex];
      
      // Put (update) a specific task, using axios
         // Done by replacing the "name" property with the content in the input
      const response = await axios.put(`${this.apiUrl}/tasks/${task.id}`, {
         name: this.state.newTask
      });

      const tasks = this.state.tasks;
      // Replace the existing task with the new task
      tasks[this.state.editingIndex] = response.data;
      // Reset the list to how it was before, with the exception of the changes made
      this.setState({ 
         tasks,
         editing: false,
         editingIndex: null,
         newTask: ''
      });
      
      this.alert('Task updated successfully.');
   }

   alert(notification){
      this.setState({
         notification
      });
      setTimeout(() => {
         this.setState({
            notification: null
         })
      }, 2000);
   }

   render() {
      console.log(this.state.newTask);
      
      return (
         <div className="App">
            <header className="App-header">
              <h1>Todo List</h1>
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
            <div className="container">
               {
                  this.state.notification && <div className="alert mt-4 alert-success">
                     <p className="text-center">{this.state.notification}</p>
                  </div>
               }
               <input 
                  type="text" 
                  name="task"
                  className="my-4 form-control"
                  placeholder="Add a new task"
                  value={this.state.newTask}
                  onChange={this.handleChange}
               />
               <button 
                  onClick={this.state.editing ? this.updateTask : this.addTask}
                  className="btn-success mb-3 form-control"
                  disabled={this.state.newTask.length < 5}
               >
                  {this.state.editing ? 'Update Task' : 'Add Task'}
               </button>
               {
                  // If loading state is true...
                     // Display the loading gif file
                  this.state.loading && <img src={loadingGif} alt=""/>
               }
               {
                  // If the app is in either editing or loading state...   
                     // Do not display the list
                  (!this.state.editing || !this.state.loading) && <ul className="list-group">
                     {this.state.tasks.map((item, index) => {
                        return <ListItem 
                           key={item.id}
                           item={item}
                           editTask={() => {this.editTask(index);}}
                           deleteTask={() => {this.deleteTask(index);}}
                        />;
                     })}
                  </ul>
               }
            </div>
         </div>
      );
   }
}



/*
Life cycle hooks:
   componentWillMount is executed by React before it mounts the component to the DOM
   componentDidMount is executed as soon as React completely mounts the component to the DOM
*/

export default App;
