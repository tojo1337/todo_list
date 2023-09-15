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
	const submitHandler = (e)=>{
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const formJson = Object.fromEntries(formData.entries());
		let arr = [...todoList];
		arr.push(formJson.myData);
		setTodoList(arr);
	}
	const editHandle = (event,keyVal)=>{
		console.log("Edit handler called");
	}
	const removeHandle = (event,keyVal)=>{
		//Add the delete handler in here
		let arr = [...todoList];
		let newArr = new Array();
		for(let i=0;i<arr.length;i++){
			if(i===keyVal){
				continue;
			}else {
				newArr.push(arr[i]);
			}
		}
		setTodoList(newArr);
	}
	const List = ()=>{
		let arr = [...todoList];
		const data = arr.map(data=>{
			let keyVal = arr.indexOf(data);
			return (
				<tr key={keyVal}>
					<td>{data}</td>
					<td>
						<button className="btn btn-outline-warning" onClick={(e)=>editHandle(e,keyVal)}>edit</button>
						<button className="btn btn-outline-danger" onClick={(e)=>removeHandle(e,keyVal)}>remove</button>
					</td>
				</tr>
			);
		});
		return (
			<table className="table table-borderless">
				<tbody>
					{data}
				</tbody>
			</table>
		);
	}
	const saveHandle = ()=>{
		console.log("Save button clicked");
	}
	return(
		<div className="container simple-greet">
			<form className="form-grid" method="post" onSubmit={submitHandler}>
				<div className="row">
					<div className="col">
						<input className="form-control" type="text" name="myData" />
					</div>
					<div className="col">
						<button type="submit" className="btn btn-outline-primary">enter</button>
					</div>
				</div>
			</form>
			<button className="btn btn-outline-primary" onClick={saveHandle}>save</button>
			<List />
		</div>
	)
}

export default SimpleGreet;