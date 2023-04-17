const database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    reminders: [
      {
        id: 1,
        title: "Groceries",
        description: "Bring the following groceries:",
        completed: false,
        subtasks: [
          { id: 1, subtask: "Mango", completed: false },
          { id: 2, subtask: "Orange", completed: false },
          { id: 3, subtask: "Banana", completed: false },
        ],
        tags: [],
      },
      {
        id: 2,
        title: "Web Assignment",
        description: "Make personal webpage",
        completed: false,
        subtasks: [],
        tags: ["BCIT", "ACIT-2520"],
        dueDate: "2023-04-17T11:00",
      },
    ],
    frndList: [],
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    reminders: [
      {
        id: 1,
        title: "Groceries",
        description: "Bring groceries",
        completed: false,
        subtasks: [{ id: 1, subtask: "Apple", completed: false },
        { id: 2, subtask: "Kiwi", completed: false },
        { id: 3, subtask: "Banana", completed: false },],
        tags: ['Important'],
      },
    ],
    frndList: [],
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    reminders: [],
  },
];

const userModel = {
  findOne: (email) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
};

module.exports = { database, userModel };
