// variables to select the task in progress and task completed columns
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

//Variable for a reference to id="page-content" inside of the main element.
var pageContentEl = document.querySelector("#page-content");

//A variable to create a counter that increments by one each time a task is created.
var taskIdCounter = 0;
var formEl= document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

// Creating task array variable for Local storage since local storage only picks up strings.
var tasks = [];

//By adding the event argument to this function, we can use the data and functionality that object holds. We did that when we added event.preventDefault(); to the handler function's code.
var taskFormHandler = function(event){
    event.preventDefault();
    // Use [] brackets in a selector to select an HTML element by one of its attributes.
    // We are selecting the <input> element on the page that has a name attribute value of "task-name".
    //single quotes wrap the attribute's value and double quotes wrap the entire selector so it won't fail.
    // Use console.dir(); to find the "value" property and add it at the end of the input as shown.
    // Now the value of the taskNameInput variable will be the text we entered in the <input.
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();
    
    
    var isEdit = formEl.hasAttribute("data-task-id");
    
    //has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

    // no data attribute, so create object as normal and pass to createTaskEl function
    else {

    //package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"

    };

    // send it as an argument to createTaskEl basically saying "im going in this function to take this out."
    createTaskEl(taskDataObj);
}
   
};

//creating a completeEditTask function to pass through whats being called for in the taskFormHandler function.
var completeEditTask = function(taskName, taskType, taskId) {
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    // the parseInt() function parses a string argument and returns an integer of the specified mathematical number.
    for (var i =0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[1].type = taskType;
        }
    };

    saveTasks();

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var createTaskEl = function(taskDataObj){
    console.log(taskDataObj);
    

 //create list item
 var listItemEl = document.createElement("li");
 listItemEl.className = "task-item";

 //add task id as a custom attribute by using data-* method
 listItemEl.setAttribute("data-task-id", taskIdCounter);
 

 //create div to hold task info and add to list item
 var taskInfoEl = document.createElement("div");

 //give it a class name
 taskInfoEl.className = "task-info";
 // add HTML content to div
 taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
 
 //append the <div> to <li>
 listItemEl.appendChild(taskInfoEl);

 // created this to get the id of the newly created DOM element gets added to the task's object as well.
 taskDataObj.id = taskIdCounter;

 // push() method adds any content between the parentheses to the end of the specified array.
 tasks.push(taskDataObj);

 saveTasks();

 var taskActionsEl = createTaskActions(taskIdCounter);
 listItemEl.appendChild(taskActionsEl);

// add entire list item to list
// append the entire <li> to the parent <ul>
 tasksToDoEl.appendChild(listItemEl);

 //increase task counter for the next unique id
 taskIdCounter++;

};

var createTaskActions = function(taskId) {

    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //Create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

//Create delete button
var deleteButtonEl = document.createElement("button");
deleteButtonEl.textContent = "Delete";
deleteButtonEl.className = "btn delete-btn";
deleteButtonEl.setAttribute("data-task-id", taskId);
actionContainerEl.appendChild(deleteButtonEl);

//Creating a dropdown
var statusSelectEl = document.createElement("select");
statusSelectEl.className = "select-status";
statusSelectEl.setAttribute("name", "status-change");
statusSelectEl.setAttribute("data-task-id", taskId);
actionContainerEl.appendChild(statusSelectEl);

//creating an array for the for loop
var statusChoices = ["To Do", "In Progress", "Completed"];

//creating a for loop using the above array
for (var i = 0; i < statusChoices.length; i++){
    //create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);
    
    //append to select
    statusSelectEl.appendChild(statusOptionEl);
}


return actionContainerEl;
};

var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")){
        // get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }

    //delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

//adding an Edit Task Function
var editTask = function(taskId) {
    

    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task namr and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    
    
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    
    //selects the input form and dropdown to display again when edit button is clicked
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    
    //Selects the Add Task button and turns the "add Task" text to "Save Task" when edit button is clicked.
    document.querySelector("#save-task").textContent = "Save Task";

    //this will add the taskId to the data-task-id attribute on the form its self.
    formEl.setAttribute("data-task-id", taskId);
};

//adding a delete Task Function
var deleteTask = function(taskId) {
    //allows us to find a different element with the same data-task-id attriubute. A little more specific when queryselecting 
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
taskSelected.remove();

//create new array to hold updated list of tasks
var updatedTaskArr = [];

//loop through current tasks
for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  //reassign tasks array to be the same as updatedTaskArr
  tasks= updatedTaskArr;

  saveTasks();

};

var taskStatusChangeHandler = function(event) {
//get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

//get the currently selected option's value and convert to lowercase
var statusValue = event.target.value.toLowerCase();

//find the parent task item element based on the id
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
}

else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
}

else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
}

//update task's in tasks array
for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
    }
}

saveTasks();
};

var saveTasks = function(){
    //JavaScript Object Notation, which is a means of organizing and structuring data that's transferred from one place to another. 
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
// change event that triggers, as the name implies, any time a form element's value changes.
pageContentEl.addEventListener("change", taskStatusChangeHandler);
    