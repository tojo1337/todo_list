import axios from "axios";
import {useState} from "react";
import {useEffect} from "react";
const SimpleGreet = ()=>{
	const getDataUrl = "http://localhost:8080/getter";
	const setDataUrl = "http://localhost:8080/setter";
	const [todoList,setTodoList] = useState([]);
	const dataFetch = (data,setFunc)=>{
		let arr = data.data;
		let setData = new Array();
		for(var i=0;i<arr.length;i++){
			setData.push(arr[i].data);
		}
		setFunc(setData);
	}
	useEffect(()=>{
		axios.get(getDataUrl)
		.then((resp)=>{
			dataFetch(resp,setTodoList);
		}).catch((err)=>{
			console.log(err);
		});
	},[]);
	const handler = (e)=>{
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const formJson = Object.fromEntries(formData.entries());
		axios.post(setDataUrl,{
			data:formJson.myData
		})
		.then((response)=>{
			console.log(response);
			axios.get(getDataUrl)
			.then((resp)=>{
				dataFetch(resp,setTodoList);
			})
		})
		.catch((err)=>{
			console.log(err);
		});
	}
	const List = ()=>{
		let arr = [...todoList];
		const data = arr.map(data=>{return (
				<li key={arr.indexOf(data)}>{data}</li>	
			);
		});
		return (
			<ul>
				{data}
			</ul>
		);
	}
	return(
		<div className="simple-greet">
			<form method="post" onSubmit={handler}>
				<label htmlFor="Data">Data : </label>
				<input type="text" name="myData" />
				<button type="submit">enter</button>
			</form>
			<p>
				TODO list : <br /> 
			</p>
			<List />
		</div>
	)
}

export default SimpleGreet;