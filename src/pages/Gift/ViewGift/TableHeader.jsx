import ActionIcons from "../../../components/general/ActionIcons";
import TableImageView from "../../../components/general/TableImageView";

export const Columns = (setOpen, setEditData) => [
  {
    name: "Sr. No.",
    selector: (row) => row.serialNo,
    width: "120px",
    sortable: true,
  },
  {
    name: "Company Name",
    selector: (row) => row.company.fullName,
    grow: 1,
    sortable: true,
    cell: (row) => (
      <>
        <TableImageView src={row.company.avatar} />
        {row.company.fullName}
      </>
    ),
  },

  {
    name: "Gift Name",
    selector: (row) => row.giftName,
    grow: 1,
    sortable: true,
    cell: (row) => (
      <>
        <TableImageView src={row.giftImage} />
        {row.giftName}
      </>
    ),
  },
  {
    name: "Gift Category",
    width: "200px",
    selector: (row) => row.giftCategory,
    grow: 1,
    sortable: true,
  },
  {
    name: "Gift Description",
    selector: (row) => row.giftDescription,
    grow: 1,
    sortable: true,
  },
  {
    name: "Actions",
    center: true,
    width: "100px",
    cell: (row) => <ActionIcons rowData={row} edit={true} del={true} type="gifts" blocked={row.scannedBy} />,
  },
];
