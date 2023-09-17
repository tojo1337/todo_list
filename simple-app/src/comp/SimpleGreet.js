import axios from "axios";
import {useState} from "react";
import {useEffect} from "react";
import Modal from "react-bootstrap/Modal";
const SimpleGreet = ()=>{
	const getDataUrl = "http://localhost:8080/getter";
	const setDataUrl = "http://localhost:8080/setter";
	const [todoList,setTodoList] = useState([]);
	const [show,setShow] = useState(false);
	const [editVal,setEditVal] = useState(new Map());
	const dataFetch = (data,setFunc)=>{
		let arr = data.data;
		let setData = [];
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
		let arr = [...todoList];
		let map = new Map();
		map.set(arr[keyVal],keyVal);
		setEditVal(map);
		setShow(true);
	}
	const ModalShow = ()=>{
		let handleClose = ()=>{setShow(false)}
		let editSubmitHandler = (e)=>{
			e.preventDefault();
			let arr = [...todoList];
			let mappedData = [...editVal];
			console.log(mappedData.entries().next());
			setEditVal(new Map());
		}
		return(
			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
					<Modal.Title>Edit data</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form className="form-grid" method="post" onSubmit={editSubmitHandler}>
						<div className="row">
							<input className="form-control" type="text" placeholder={editVal} disabled />
						</div>
						<div className="row">
							<input className="form-control" type="text" name="myData" />
						</div>
						<div className="row">
							<div className="col">
								<button type="submit" className="btn btn-outline-primary">save</button>
								<button className="btn btn-outline-primary" onClick={handleClose}>close</button>
							</div>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		)
	}
	const removeHandle = (event,keyVal)=>{
		//Add the delete handler in here
		let arr = [...todoList];
		let newArr = [];
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
	const saveHandle = (evt)=>{
		evt.preventDefault();
		console.log("This will send data to : "+setDataUrl);
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
						<button className="btn btn-outline-primary" onClick={(e)=>{saveHandle(e)}}>save</button>
					</div>
				</div>
			</form>
			<List />
			<ModalShow />
		</div>
	)
}

export default SimpleGreet;