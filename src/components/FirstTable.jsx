import { useState } from "react";
import TablePage from "./TablePage";
import { useRecoilState } from "recoil";
import { firstPageData } from "../states/todoState";

export default function SecondTable(){
    const [leftTableData, setLeftTableData] = useState([]);
    
    const [rightTableData, setRightTableData] = useRecoilState(firstPageData);

    return (
        <TablePage 
            index="first"
            leftTableData={leftTableData}
            rightTableData={rightTableData}
            setLeftTableData={setLeftTableData}
            setRightTableData={setRightTableData}
        />
    )
}