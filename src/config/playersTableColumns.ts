export const columns = [
    { key: "photo", label: "Foto", sortable: false },
    { key: "name", label: "Nome", sortable: true },
    { key: "role", label: "Ruolo", sortable: true },
    { key: "mantra_role", label: "Ruolo Mantra", sortable: true },
    { key: "team", label: "Squadra", sortable: true },
    { key: "fantateam", label: "Fantateam", sortable: true },
    { key: "played_matches", label: "PG", sortable: true, align: "right" },
    { key: "average_vote", label: "MV", sortable: true, align: "right" },
    {
        key: "average_fantavote",
        label: "FM",
        sortable: true,
        align: "right",
    },
    { key: "fantaprice", label: "Prezzo", sortable: true, align: "right" },
    {
        key: "out_of_list",
        label: "Fuori Lista",
        sortable: false,
        align: "center",
    },
    { key: "currentBidder", label: "Offerente Attuale", sortable: true, align: "center" },
];
