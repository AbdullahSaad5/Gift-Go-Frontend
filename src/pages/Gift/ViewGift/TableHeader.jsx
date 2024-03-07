import ActionIcons from "../../../components/general/ActionIcons";

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
  },

  {
    name: "Gift Name",
    selector: (row) => row.giftName,
    grow: 1,
    sortable: true,
    cell: (row) => (
      <>
        <img
          src={row.giftImage}
          alt="gift"
          width={40}
          height={40}
          style={{
            borderRadius: "50%",
            marginRight: "10px",
            objectFit: "cover",
          }}
        />
        {row.giftName}
      </>
    ),
  },
  {
    name: "Gift Description",
    selector: (row) => row.giftDescription,
    grow: 1,
    sortable: true,
  },
  {
    name: "Drop Category",
    width: "200px",
    selector: (row) => row.giftCategory,
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
