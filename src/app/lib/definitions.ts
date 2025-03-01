// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: "pending" | "paid";
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
};

export type TUsersTable = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type TUserNames = {
  name: string;
};

// --------------------------------------------------------
// Games
// --------------------------------------------------------
export type TGamesTable = {
  id: number;
  timestamp: Date;
  new_session: string;
  suid: number;
  map: string;
  players: number;
  players_1st: string;
  players_2nd: string;
  players_3rd: string;
  players_4th: string;
  characters_1st: string;
  characters_2nd: string;
  characters_3rd: string;
  characters_4th: string;
  season: number;
  image_url: string;
  suid_window_start: Date;
  suid_window_end: Date;
};

export type TMostRecentSeasonGamesCountInitial = {
  count: string;
  season: number;
};

export type TMostRecentSeasonGamesCount = {
  count: number;
  season: number;
};

// --------------------------------------------------------
// Characters
// --------------------------------------------------------
export type TCharactersTable = {
  id: number;
  character: string;
  image_url_icon: string;
  image_url_portrait_lost: string;
  image_url_portrait_won: string;
  type: string;
};

// --------------------------------------------------------
// Maps
// --------------------------------------------------------
export type TMapsTable = {
  id: number;
  map: string;
  image_url: string;
};
