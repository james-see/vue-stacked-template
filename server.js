const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });
const User = require("./models/User");
const Post = require("./models/Post");
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("DB connected"))
	.catch(err => console.error(err));
const todos = [
	{ task: "Wash car", completed: false },
	{ task: "Clean room", completed: true }
];

const typeDefs = gql`
	type Todo {
		task: String
		completed: Boolean
	}
	# built in
	type Query {
		getTodos: [Todo]
	}
	# built in
	type Mutation {
		addTodo(task: String, completed: Boolean): Todo
	}
`;

const resolvers = {
	Query: {
		getTodos: () => todos
	},
	Mutation: {
		addTodo: (_, { task, completed }) => {
			const todo = { task, completed };
			todos.push(todo);
			return todo;
		}
	}
};

const server = new ApolloServer({
	typeDefs,
	context: {
		User,
		Post
	}
});

server.listen().then(({ url }) => {
	console.log(`Server listening on ${url}`);
});
