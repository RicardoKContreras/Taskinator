//A variable to create a counter that increments by one each time a task is created.
var taskIdCounter = 0;
var formEl= document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

//By adding the event argument to this function, we can use the data and functionality that object holds. We did that when we added event.preventDefault(); to the handler function's code.
var taskFormHandler = function(event){
    event.preventDefault();
    // Use [] brackets in a selector to select an HTML element by one of its attributes.
    // We are selecting the <input> element on the page that has a name attribute value of "task-name".
    //single quotes wrap the attribute's value and double quotes wrap the entire selector so it won't fail.
    // Use console.dir(); to find the "value" property and add it at the end of the input as shown.
    // Now the value of the taskNameInput variable will be the text we entered in the <input>.
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    //package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput

    };

    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
   
};

var createTaskEl = function(taskDataObj){

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



formEl.addEventListener("submit", taskFormHandler);
    