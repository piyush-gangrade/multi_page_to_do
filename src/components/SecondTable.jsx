import{ useState } from "react";
import TablePage from "./TablePage";
import { secondPageData } from "../states/todoState";
import { useRecoilState } from "recoil";

export default function SecondTable(){
    const [leftTableData, setLeftTableData] = useState([]);
    const [rightTableData, setRightTableData] = useRecoilState(secondPageData);

    return (
        <TablePage 
            index="second"
            leftTableData={leftTableData}
            rightTableData={rightTableData}
            setLeftTableData={setLeftTableData}
            setRightTableData={setRightTableData}
        />
    )
}