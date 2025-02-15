import PropTypes from "prop-types";

export const tableProps = {
    index: PropTypes.string,
    leftTableData: PropTypes.array,
    rightTableData: PropTypes.array,
    setLeftTableData: PropTypes.func,
    setRightTableData: PropTypes.func
}