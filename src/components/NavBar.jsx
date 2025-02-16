import { NavLink } from "react-router";

export function NavBar(){

    const activeStyle = ({isActive}) => {
        return ({
            color: isActive? "#7480ff": "#000000"
        })
    }

    return(
        <>
            <nav data-testid="nav-bar">
                <ul className="flex w-1/3 mx-auto mt-4 mb-2 justify-around gap-4 text-xl font-medium">
                    <li><NavLink to="/" style={activeStyle} ><h1>Main</h1></NavLink></li>
                    <li><NavLink to="first" style={activeStyle} ><h1>First</h1></NavLink></li>
                    <li><NavLink to="second" style={activeStyle} ><h1>Second</h1></NavLink></li>
                </ul>
            </nav>
        </>
    )
}