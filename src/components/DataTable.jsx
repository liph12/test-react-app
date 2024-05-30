import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import * as Icons from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";

function createData(
  id,
  offerNo,
  roomCode,
  subjDesc,
  subjCode,
  subjUnits,
  subjSched
) {
  return { id, offerNo, roomCode, subjDesc, subjCode, subjUnits, subjSched };
}

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [onProgress, setOnProgress] = useState(false);

  const handleDeleteSubject = async (idx) => {
    const tmpRows = rows.filter((r) => r.id !== idx);

    setRows(tmpRows);

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete-subject/${idx}`
      );
      const result = response.data;

      console.log(result);
    } catch (e) {
      console.log(e);
    } finally {
      // to do
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setOnProgress(true);

        const response = await axios.get(
          "http://localhost:8000/api/get-subjects"
        );
        const data = response.data;
        const dataRows = data.map((row) =>
          createData(
            row.id,
            row.offering_no,
            row.room_code,
            row.subj_description,
            row.subj_code,
            row.subj_units,
            row.subj_schedule
          )
        );

        setRows(dataRows);
      } catch (e) {
        console.log(e);
      } finally {
        setOnProgress(false);
      }
    };

    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      {onProgress && <LinearProgress />}
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Offering No.</TableCell>
            <TableCell align="left">Room Code</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="left">Code</TableCell>
            <TableCell align="left">Units</TableCell>
            <TableCell align="left">Schedule</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, key) => (
            <TableRow
              key={key}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.offerNo}
              </TableCell>
              <TableCell align="left">{row.roomCode}</TableCell>
              <TableCell align="left">{row.subjDesc}</TableCell>
              <TableCell align="left">{row.subjCode}</TableCell>
              <TableCell align="left">{row.subjUnits}</TableCell>
              <TableCell align="left">{row.subjSched}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Icons.Delete />}
                  size="small"
                  onClick={() => handleDeleteSubject(row.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
