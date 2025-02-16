import { useState } from "react";
import { firstPageData, mainPageData, secondPageData } from "../states/todoState";
import { useRecoilState } from "recoil";

export function MainTable(){
    const [taskId, setTaskId] = useState(201);
    
    const [firstTableData, setFirstTableData] = useRecoilState(firstPageData);
    const [secondTableData, setSecondTableData] = useRecoilState(secondPageData);
    const [tableData, setTableData] = useRecoilState(mainPageData);

    const [inputData, setInputData] = useState({
        id: "",
        userId: "",
        title: "",
        completed: false
    })

    useState(()=>{
        const id = tableData.reduce((acc, data)=>{
            if(data.id > 200) return acc +1;
            return acc;
        }, 201)
        setTaskId(id);
    },[])
    
    const inputHandler = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setInputData(data => ({
            ...data,
            [`${name}`] : value
        }))
    }
    
    const handleSubmit = (e)=>{
        e.preventDefault();
        inputData.id = taskId;
        setTaskId(id => id+1);
        setTableData(data => ([
            ...data,
            inputData
        ]))
        
        setInputData(() => ({
            id: "",
            title: "",
            userId: "",
            completed: false,
        }))
    }

    const hanldeDeleteBtn = (data)=>{
        const filterData = tableData.filter(ele => ele.id !== data.id);
        setTableData(filterData);
    }

    const sendDataBack = (data)=>{
        if(data.id > 0 && data.id < 101){
            if(!firstTableData.includes(data)){
                setFirstTableData(oldData => ([
                    ...oldData,
                    data
                ]))
            }
        }
        else if(data.id > 100 && data.id <= 200){
            if(!secondTableData.includes(data)){
                setSecondTableData(oldData => ([
                    ...oldData,
                    data
                ]))
            }
        }
    }
    
    const handleBackBtn = (data)=>{
        sendDataBack(data);
        hanldeDeleteBtn(data);
    }

    const handleClearBtn = ()=>{
        for(let data of tableData){
            sendDataBack(data)
        }
        setTableData([])
    }
    
    const tableEl = tableData.map(data => (
        <tr key={data.id} data-testid="task-item" className="text-[#003459] font-medium">
                <td className="text-center" data-testid="task-id">{data.id}</td>
                <td data-testid="task-title">{data.title}</td>
                <td className="text-center" data-testid="task-userId">{data.userId}</td>
                <td className="text-center">{`${data.completed}`}</td>
                <td>
                    <button data-testid="task-back" className="btn btn-sm btn-outline hover:bg-[#003459]" onClick={()=>handleBackBtn(data)}>Back</button>
                </td>
                <td>
                    <button data-testid="task-remove" className="btn btn-sm btn-outline" onClick={()=>hanldeDeleteBtn(data)}>Remove</button>
                </td>
            </tr>
    ))
    
    return (
        <div className="px-4 py-8 grid grid-cols-3 gap-8" >
            <div className={`col-span-1 ${tableData.length>5?"":"col-start-2"}`}>
                <h1 className="text-center text-2xl font-semibold">User Data</h1>
                <form className="mx-4  form-control p-2 gap-2 rounded" onSubmit={handleSubmit}>
                    {/* <input type="number" name="id" placeholder="Enter Id" className="input input-bordered" onChange={inputHandler} value={inputData.id} required/> */}
                    <input type="text" name="title" placeholder="Enter Title" className="input input-bordered" onChange={inputHandler} value={inputData.title} required/>
                    <input type="number" name="userId" placeholder="Enter User Id" className="input input-bordered" onChange={inputHandler} value={inputData.userId} required/>
                    <button className="btn btn-outline text-lg bg-[#003459] text-white" >Add</button>
                </form>
            </div>
            <div className={tableData.length>5?"col-span-2":"col-span-3"}>
                <div className={`${tableData.length>5?"h-[600px] overflow-y-scroll":"h-[350px] w-2/3 m-auto"} border-2 border-[#d2d2d2]`}>
                    <table className="w-full table" data-testid="main-table">
                        <thead>
                            <tr className="text-base bg-[#007EA7] text-white">
                                <th className="w-[55px]">Id</th>
                                <th>Title</th>
                                <th className="w-[100px]">User Id</th>
                                <th className="w-[125px]">Completed</th>
                                <th className="w-[90px]"></th>
                                <th className="w-[110px]"></th>
                            </tr>
                        </thead>
                        <tbody className="font-normal">
                            {tableEl}
                        </tbody>
                    </table>
                </div>
                <div className="mr-8 mt-4 flex justify-end gap-8">
                    <button data-testid="purge-task" className="btn btn-outline rounded" onClick={()=>setTableData([])}>Purge</button>
                    <button data-testid="clear-task" className="btn btn-outline rounded hover:bg-[#003459]" onClick={handleClearBtn}>Clear</button>
                </div>
            </div>
        </div>
    )
}