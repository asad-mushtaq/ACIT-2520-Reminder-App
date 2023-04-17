let Database = require("../database");
const { EOL } = require("os");
let remindersController = {
  list: (req, res) => {
    let usrList = [];
    const frndList=[];
    Database.database.forEach((ele) => {
      usrList.push(ele.name);
    });
    let searchResult = [];
    if (req.query.inpVal) {
      for (usrName of usrList) {
        if (usrName.toLowerCase().includes(req.query.inpVal.toLowerCase()) && !(usrName===req.user.name)) {
          searchResult.push(usrName);
        }
      }
    }
    frndList.push(req.query.addBtn);
    Database.database.forEach((ele) => {
      for (usrName of frndList) {
        if (ele.name === usrName) {
          for (reminder of ele.reminders) {
            let fId = req.user.reminders.length;
            flag=req.user.reminders.some(usrRmndr => usrRmndr.description===reminder.description)
            if(!reminder.title.includes(`${req.user.name}'s reminder:`) && flag===false){
              remObj={
                id: fId+1,
                title:ele.name + "'s reminder: " + reminder.title,
                description:reminder.description,
                subtasks:reminder.subtasks,
                completed:reminder.completed,
                tags:reminder.tags,
                dueDate:reminder.dueDate
              }
              req.user.reminders.push(remObj);
              fId++;
            }
          }
        }
      }
    });
    res.render("reminder/index", {
      reminders: req.user.reminders,
      result: searchResult,
    });
  },
  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: req.user.reminders });
    }
  },

  create: (req, res) => {
    let reminder = {
      id: req.user.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
      subtasks: [],
      dueDate: "",
      tags: [],
    };

    if (req.body.subtasks != "") {
      subtaskList = req.body.subtasks.trim().split(EOL);
      let id = 1;
      for (task of subtaskList) {
        let taskObj = {
          id: id,
          subtask: task,
          completed: false,
        };
        reminder.subtasks.push(taskObj);
        id++;
      }
    }
    if (req.body.tags != "") {
      tagList = req.body.tags.trim().split(EOL);
      for (tag of tagList) {
        reminder.tags.push(tag);
      }
    }
    reminder.dueDate = req.body.datetime;
    req.user.reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    // implement this code
    let reminderToUpdate = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      if (reminder.id == reminderToUpdate) {
        reminder.title = req.body.title;
        reminder.description = req.body.description;
        if (req.body.completed === "false") {
          reminder.completed = false;
        } else {
          reminder.completed = true;
        }
        reminder.subtasks = [];
        if (req.body.subtasks.trim() !== "") {
          subtaskList = req.body.subtasks.trim().split(EOL);
          let id = 1;
          for (task of subtaskList) {
            let taskObj = {
              id: id,
              subtask: task,
              completed: false,
            };
            reminder.subtasks.push(taskObj);
            id++;
          }
          for (i = 0; i < reminder.subtasks.length; i++) {
            if (req.body[i + 1]) {
              reminder.subtasks[i].completed = true;
            } else {
              reminder.subtasks[i].completed = false;
            }
          }
        }
        reminder.tags = [];
        if (req.body.tags.trim() !== "") {
          tagList = req.body.tags.trim().split(EOL);
          for (tag of tagList) {
            reminder.tags.push(tag);
          }
        }
        reminder.dueDate = req.body.datetime;
      }
    });
    res.redirect("/reminders");
  },

  delete: (req, res) => {
    // Implement this code
    let reminderToDelete = req.params.id;
    const newReminder = req.user.reminders.filter(
      (reminder) => reminder.id != reminderToDelete
    );
    req.user.reminders = newReminder;
    res.redirect("/reminders");
  },
};

module.exports = remindersController;
