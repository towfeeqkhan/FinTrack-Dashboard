import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Transaction,
  FilterState,
  TransactionState,
  SortField,
  SortOrder,
  Category,
  TransactionType,
} from "../types";
import {
  fetchTransactions,
  addTransaction as apiAdd,
  updateTransaction as apiUpdate,
  deleteTransaction as apiDelete,
} from "../api/mockApi";

type Action =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CATEGORY_FILTER"; payload: Category | "all" }
  | { type: "SET_TYPE_FILTER"; payload: TransactionType | "all" }
  | { type: "SET_DATE_FROM"; payload: string }
  | { type: "SET_DATE_TO"; payload: string }
  | { type: "SET_SORT"; payload: { sortBy: SortField; sortOrder: SortOrder } }
  | { type: "CLEAR_FILTERS" };

const initialFilters: FilterState = {
  search: "",
  category: "all",
  type: "all",
  dateFrom: "",
  dateTo: "",
  sortBy: "date",
  sortOrder: "desc",
};

const initialState: TransactionState = {
  transactions: [],
  filters: initialFilters,
  isLoading: true,
};

function reducer(state: TransactionState, action: Action): TransactionState {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload, isLoading: false };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SEARCH":
      return {
        ...state,
        filters: { ...state.filters, search: action.payload },
      };
    case "SET_CATEGORY_FILTER":
      return {
        ...state,
        filters: { ...state.filters, category: action.payload },
      };
    case "SET_TYPE_FILTER":
      return { ...state, filters: { ...state.filters, type: action.payload } };
    case "SET_DATE_FROM":
      return {
        ...state,
        filters: { ...state.filters, dateFrom: action.payload },
      };
    case "SET_DATE_TO":
      return {
        ...state,
        filters: { ...state.filters, dateTo: action.payload },
      };
    case "SET_SORT":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "CLEAR_FILTERS":
      return { ...state, filters: initialFilters };
    default:
      return state;
  }
}

interface TransactionContextType {
  state: TransactionState;
  filteredTransactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  addNewTransaction: (t: Omit<Transaction, "id">) => Promise<void>;
  editTransaction: (t: Transaction) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  setSearch: (search: string) => void;
  setCategoryFilter: (category: Category | "all") => void;
  setTypeFilter: (type: TransactionType | "all") => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  setSort: (sortBy: SortField, sortOrder: SortOrder) => void;
  clearFilters: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchTransactions().then((data) => {
      dispatch({ type: "SET_TRANSACTIONS", payload: data });
    });
  }, []);

  const filteredTransactions = useCallback(() => {
    let result = [...state.transactions];
    const { search, category, type, dateFrom, dateTo, sortBy, sortOrder } =
      state.filters;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(lower) ||
          t.category.toLowerCase().includes(lower),
      );
    }
    if (category !== "all") {
      result = result.filter((t) => t.category === category);
    }
    if (type !== "all") {
      result = result.filter((t) => t.type === type);
    }
    if (dateFrom) {
      result = result.filter((t) => t.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((t) => t.date <= dateTo);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "date":
          cmp = a.date.localeCompare(b.date);
          break;
        case "amount":
          cmp = a.amount - b.amount;
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "type":
          cmp = a.type.localeCompare(b.type);
          break;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [state.transactions, state.filters])();

  const totalIncome = state.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  const addNewTransaction = async (t: Omit<Transaction, "id">) => {
    const newT: Transaction = {
      ...t,
      id: Math.random().toString(36).substring(2, 11),
    };
    await apiAdd(newT);
    dispatch({ type: "ADD_TRANSACTION", payload: newT });
  };

  const editTransaction = async (t: Transaction) => {
    await apiUpdate(t);
    dispatch({ type: "UPDATE_TRANSACTION", payload: t });
  };

  const removeTransaction = async (id: string) => {
    await apiDelete(id);
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  return (
    <TransactionContext.Provider
      value={{
        state,
        filteredTransactions,
        totalBalance,
        totalIncome,
        totalExpenses,
        addNewTransaction,
        editTransaction,
        removeTransaction,
        setSearch: (s) => dispatch({ type: "SET_SEARCH", payload: s }),
        setCategoryFilter: (c) =>
          dispatch({ type: "SET_CATEGORY_FILTER", payload: c }),
        setTypeFilter: (t) => dispatch({ type: "SET_TYPE_FILTER", payload: t }),
        setDateFrom: (d) => dispatch({ type: "SET_DATE_FROM", payload: d }),
        setDateTo: (d) => dispatch({ type: "SET_DATE_TO", payload: d }),
        setSort: (sortBy, sortOrder) =>
          dispatch({ type: "SET_SORT", payload: { sortBy, sortOrder } }),
        clearFilters: () => dispatch({ type: "CLEAR_FILTERS" }),
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions(): TransactionContextType {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within TransactionProvider");
  }
  return context;
}
