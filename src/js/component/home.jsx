import React, { useState, useEffect } from "react";
import "./home.css";

const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		fetch('https://playground.4geeks.com/todo/users/amandanunezbr')
			.then((resp) => resp.json())
			.then((data) => setTodos(data.todos || []))
			.catch((error) => console.log("Error al cargar las tareas:", error));
	}, []);

	const updateTodosOnServer = (todosList) => {
		fetch('https://playground.4geeks.com/todo/users/amandanunezbr', {
			method: "PUT",
			body: JSON.stringify(todosList),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => {
				console.log(resp.ok); // Será true si la respuesta es exitosa
				console.log(resp.status); // El código de estado 200, 300, 400, etc.
				return resp.json(); // Intentará parsear el resultado a JSON
			})
			.then(data => {
				console.log(data);
			})
			.catch(error => {
				console.log("Error al actualizar las tareas:", error);
			});
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && inputValue.trim() !== "") {
			const newTodos = [
				...todos,
				{ label: inputValue.trim(), is_done: false, id: Date.now() } 
			];
			setTodos(newTodos);
			setInputValue("");
			updateTodosOnServer(newTodos);
		}
	};

	const deleteTodo = (index) => {
		const newTodos = todos.filter((_, currentIndex) => currentIndex !== index);
		setTodos(newTodos);
		updateTodosOnServer(newTodos);
	};

	const clearAllTodos = () => {
		setTodos([]);
		updateTodosOnServer([]); 
	};

	return (
		<>
			<div className="header">
				<h1>todos</h1>
			</div>
			
			<div className="todo-list">
				
				<input
					type="text"
					placeholder="What needs to be done?"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyPress={handleKeyPress}
				/>
				
				<ul>
					{todos.map((todo) => (
						<li key={todo.id} className="todo-item"> 
							{todo.label}
							<button 
								onClick={() => deleteTodo(todos.findIndex(t => t.id === todo.id))}
								className="delete-btn"
							>
								×
							</button>
						</li>
					))}
				</ul>

				<div className="todo-count">
					{todos.length} item{todos.length !== 1 ? "s" : ""} left
				</div>
				
				<button onClick={clearAllTodos} className="clear-btn">
					Clear All
				</button>
			</div>
		</>
	);
};

export default Home;