import axios from "axios";
import {useState} from "react";
import {useEffect} from "react";
import Modal from "react-bootstrap/Modal";
const SimpleGreet = ()=>{
	const getDataUrl = "http://localhost:8080/getter";
	const setDataUrl = "http://localhost:8080/setter";
	const [todoList,setTodoList] = useState([]);
	const [show,setShow] = useState(false);
	const [editVal,setEditVal] = useState({"editId":-1,"editData":""});
	const [visible,setVisible] = useState(false);
	const [delParam,setDelParam] = useState({"delId":-1,"delData":""});
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
		let targetData = arr[keyVal];
		setEditVal({"editId":keyVal,"editData":targetData});
		setShow(true);
	}
	const EditShow = ()=>{
		let handleClose = ()=>{setShow(false)}
		let editSubmitHandler = (e)=>{
			e.preventDefault();
			var arr = [...todoList];
			var form = e.target;
			var formData = new FormData(form);
			var formJson = Object.fromEntries(formData.entries());
			var id = editVal.editId;
			var data = editVal.editData;
			for(var i=0;i<arr.length;i++){
				if((i===id)&&(data===arr[i])){
					arr[i] = formJson.myData;
				}
			}
			setTodoList(arr);
			setEditVal({"editId":-1,"editData":""});
			setShow(false);
		}
		return(
			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
					<Modal.Title>Edit data</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form className="form-grid" method="post" onSubmit={editSubmitHandler}>
						<div className="row">
							<input className="form-control" type="text" placeholder={editVal.editData} disabled />
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
		let arr = [...todoList];
		setDelParam({"delId":keyVal,"delData":arr[keyVal]});
		setVisible(true);
	}
	const DelShow = ()=>{
		let cancelHandle = ()=>{
			setVisible(false);
		}
		let delHandle = ()=>{
			let arr = [...todoList];
			let newArr = [];
			for(var i=0;i<arr.length;i++){
				if(i===delParam.delId){
					continue;
				}else {
					newArr.push(arr[i]);
				}
			}
			setTodoList(newArr);
			setDelParam({"delId":-1,"delData":""});
			setVisible(false);
		}
		return(
			<Modal show={visible} onHide={cancelHandle}>
				<Modal.Header>
					Alert!!!
				</Modal.Header>
				<Modal.Body>
					Are you willing to continue ?
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-outline-warning" onClick={delHandle}>continue</button>
					<button className="btn btn-outline-primary" onClick={cancelHandle}>cancel</button>
				</Modal.Footer>
			</Modal>
		)
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
		// Parse the data in json format and send it to the url
		// Need to know how to handle array object being returned as json in java/spring boot
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
			<EditShow />
			<DelShow />
		</div>
	)
}

export default SimpleGreet;