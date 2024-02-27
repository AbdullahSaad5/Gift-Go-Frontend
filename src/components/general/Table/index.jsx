import { Box, Loader, useMantineTheme } from "@mantine/core";
import Papa from "papaparse";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Button from "../Button";

// import { Download } from "tabler-icons-react";

const customStyles = {
  headCells: {
    style: {
      fontSize: "16px",
      fontWeight: 600,
    },
  },
  rows: {
    style: {
      fontSize: "14px",
    },
  },
};

const DataGrid = ({ columns, data, type, download = true, ...props }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [select, setSelected] = useState(null);

  const actionsMemo = React.useMemo(() => {
    data?.forEach((element) => {
      delete element?.id;
    });
    let csv = Papa.unparse(data);
    return (
      <Button
        primary={false}
        label={"Download CSV"}
        leftIcon={"download.svg"}
        onClick={() => (location.href = `data:text/csv;charset=utf-8,${encodeURI(csv)}`)}
      />
    );
  }, [data]);

  // const handleChange = ({ selectedRows }) => {
  //   setSelected(selectedRows);
  // };
  return (
    <Box
      style={{
        border: "1px solid #E5E5E5",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <DataTable
        columns={columns}
        data={data}
        pagination
        responsive
        subHeaderAlign="right"
        subHeaderWrap
        progressComponent={<Loader my={10} color={theme.primaryColor} />}
        actions={download && actionsMemo}
        customStyles={customStyles}
        {...props}
      />
    </Box>
  );
};

export default DataGrid;
