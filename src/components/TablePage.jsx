import axios from "axios";
import { useCallback, useEffect, useState} from "react";
import { useRecoilState } from "recoil";
import { mainPageData } from "../states/todoState";
import PropTypes from "prop-types";

export default function TablePage({index, leftTableData, rightTableData, setLeftTableData, setRightTableData}){
    const [mainTableData, setMainTableData] = useRecoilState(mainPageData);

    const [isLoading, setIsLoading] = useState(false);
    
    const getAPIData = useCallback(async()=>{
        try {
            setIsLoading(true)
            const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
            if(!res.data) throw res;
            
            let data;
            if(index === "first"){
                data = res.data.slice(0, 100);
                // console.log(data);
            }
            else{
                data = res.data.slice(100,200);
            }
            
            const shuffled = data
            .sort(() => 0.5 - Math.random()) // Shuffle the array
            .slice(0, 10);
            setLeftTableData(shuffled);
            
        } catch (error) {
            console.log(error)
        } finally{
                setIsLoading(false)
        }
    },[index, setLeftTableData])

    useEffect(()=>{
        getAPIData();
    }, [index, getAPIData]);

    // send data left to right table
    const addToRightTable = (data)=>{
        const filterLeftTable = leftTableData.filter(todo => todo.id != data.id);

        setLeftTableData(filterLeftTable)
        
        const checkExistens = rightTableData.filter(todo => todo.id == data.id);
        if(checkExistens.length) return;

        setRightTableData(oldData => ([
            ...oldData,
            data
        ]))
    }

    // send data back to left table from right table
    const backToLeftTable = (data)=>{
        const filterLeftTable = rightTableData.filter(todo => todo.id != data.id);
        
        setRightTableData(filterLeftTable);

        setLeftTableData(oldData => ([
            ...oldData,
            data
        ]))
    }

    // remove data of right table
    const removeData = (data)=>{
        const filterData = rightTableData.filter(todo => todo != data);

        setRightTableData(filterData)
    }

    //send data to main table
    const sendData = ()=>{
        const filterData = rightTableData.filter(data => !mainTableData.includes(data));

        setMainTableData(data => ([
            ...data,
            ...filterData
        ]))
        setRightTableData([]);
    }


    //left table row elements
    const leftTableEl = leftTableData.map(data => {
        return (
            <tr key={`left-${data.id}`} data-testid="task-item" className="text-[#003459] font-medium">
                <td className="text-center" data-testid="task-id">{data.id}</td>
                <td >{data.title}</td>
                <td className="text-center">{data.userId}</td>
                <td className="text-center">{`${data.completed}`}</td>
                <td ><button data-testid="task-add" className="btn btn-sm btn-outline hover:bg-[#003459]" onClick={()=>addToRightTable(data)}>Add</button></td>
            </tr>
        )
    })
    // right table row elements
    const rightTableEl = rightTableData.map(data => {
        return (
            <tr key={`right-${data.id}`} data-testid="task-item" className="text-[#003459] font-medium bg-[#d8e8ee]">
                <td className="text-center" data-testid="task-id">{data.id}</td>
                <td >{data.title}</td>
                <td className="text-center">{data.userId}</td>
                <td className="text-center">{`${data.completed}`}</td>
                <td>
                    <button data-testid="task-back" className="btn btn-sm btn-outline hover:bg-[#003459]" onClick={()=>backToLeftTable(data)}>Back</button>
                </td>
                <td>
                    <button data-testid="task-remove" className="btn btn-sm btn-outline" onClick={()=>removeData(data)}>Remove</button>
                </td>
            </tr>
        )
    })
    return (
        <>
            <button className="ml-4 btn btn-outline hover:bg-[#5e81ac]" onClick={getAPIData}>Refresh</button>
            
            <div className={`text-xl font-semibold text-[#003459] m-4 text-center ${(rightTableData.length>0 || leftTableData.length>0)? "hidden": ""}`}>Please click refresh to get new data.</div>

            {/* table section */}
            <div className={`p-2 grid ${(rightTableData.length>0 && leftTableData.length>0)? "grid-cols-2": "grid-cols-1"} gap-8`}>
                {/* left table */}
                {isLoading? 
                // loader component
                <div className="flex justify-center items-center">
                    <span className="loading loading-ring loading-lg" data-testid="loader"></span>
                </div>
                : <div className={`h-[620px] overflow-y-scroll ${leftTableData.length>0?"":"hidden"}`}>
                    <table className="w-full table" data-testid="left-table">
                        <thead>
                            <tr className="text-base bg-[#007EA7] text-white">
                                <th className="w-[55px]">Id</th>
                                <th >Title</th>
                                <th className="w-[85px]">User Id</th>
                                <th className="w-[115px]">Completed</th>
                                <th className="w-[70px]"></th>
                            </tr>
                        </thead>
                        <tbody className="font-normalText">
                            {leftTableEl}
                        </tbody>
                    </table>
                </div>}
                {/* right table */}
                <div className={rightTableData.length>0?"":"hidden"}>
                    <div className="h-[575px] overflow-y-scroll">
                        <table className="w-full table" data-testid="right-table">
                            <thead>
                                <tr className="text-base bg-[#007EA7] text-white">
                                    <th className="w-[55px]">Id</th>
                                    <th >Title</th>
                                    <th className="w-[85px]">User Id</th>
                                    <th className="w-[115px]">Completed</th>
                                    <th className="w-[90px]"></th>
                                    <th className="w-[110px]"></th>
                                </tr>
                            </thead>
                            <tbody className="font-normalText">
                                {rightTableEl}
                            </tbody>
                        </table>

                    </div>
                    {/* send and clear btn container */}
                    <div className="mr-8 my-2 flex justify-end gap-8">
                        <button data-testid="send-tasks" className="btn btn-outline rounded hover:bg-[#007EA7]" onClick={sendData}>Send</button>
                        <button data-testid="clear-tasks" className="btn btn-outline rounded" onClick={()=>setRightTableData([])}>Clear</button>
                    </div>
                </div>
            </div>
        </>
    )
}

TablePage.propTypes = {
    index: PropTypes.string.isRequired,
    leftTableData: PropTypes.array.isRequired,
    rightTableData: PropTypes.array.isRequired,
    setLeftTableData: PropTypes.func.isRequired,
    setRightTableData: PropTypes.func.isRequired,
  };