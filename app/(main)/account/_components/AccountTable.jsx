"use client";
import { bulkDeleteTransaction } from "@/actions/accounts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categoryColors } from "@/data/categories";
import UseFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUpIcon,
  Clock,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
const recurringInterval = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};
const ITEMS_PER_PAGE = 10;

const AccountTable = ({ transactions }) => {
  const [selectIds, setSelectIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  const router = useRouter();

  //All transactions
  const filterAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    //apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction?.description.toLowerCase().includes(searchLower)
      );
    }

    //apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction?.type === typeFilter);
    }

    //apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") {
          return transaction?.isRecurring;
        }
        return !transaction?.isRecurring;
      });
    }

    //sort by date ,amount , category
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;

        default:
          comparison = 0;
          break;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

   const totalPages = Math.ceil(
    filterAndSortedTransactions.length / ITEMS_PER_PAGE
  );
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filterAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filterAndSortedTransactions, currentPage]);


  const {
    data,
    loading,
    fetchData: bulkDeleteFn,
    error,
  } = UseFetch(bulkDeleteTransaction);

  
  // Bulk delete
  const handleBulkDelete = () => {
    if (
      !window.confirm(`Are you want to delete ${selectIds.length} transactions`)
    ) {
      return;
    }
    bulkDeleteFn(selectIds);
  };

  useEffect(() => {
    if (data && !loading) {
      toast.error("Transaction deleted successfully");
    }
  }, [data, loading]);

  // clear all the filter
  const handleClearFilter = () => {
    setRecurringFilter("");
    setSearchTerm("");
    setTypeFilter("");
    setSelectIds([]);
  };

  // sorting config
  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // checking and unchecking
  const handleSelect = (id) => {
    setSelectIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };


   const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectIds([]); // Clear selections on page change
  };

  return (
    <div className="space-y-3">
      {
        loading && (<BarLoader className="mt-4" width={"100%"} color="#8F00FF" />)
      }

      {/* Filter */}
      <div className="md:flex items-center gap-3 ">
        <div className="relative flex-1">
          <Search className="absolute size-4 top-2.5 left-3 " />
          <Input
            className={"pl-8"}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder="Search"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => setRecurringFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Transaction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
            </SelectContent>
          </Select>
          {selectIds.length > 0 && (
            <div>
              <Button
                className={"flex items-center gap-2"}
                onClick={handleBulkDelete}
                variant={"destructive"}
              >
                <Trash className="size-4" />
                Delete Selected ({selectIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              onClick={handleClearFilter}
              size={"icon"}
              variant={"outline"}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

     { /* Tables */}
      <div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  className={"bg-white"}
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectIds.length === filterAndSortedTransactions.length &&
                    filterAndSortedTransactions.length > 0
                  }
                />
              </TableHead>
              <TableHead
                className={"cursor-pointer flex items-center"}
                onClick={() => handleSort("date")}
              >
                Date
                {sortConfig.field === "date" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUpIcon className="w-4 h-4 pt-1 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 pt-1 ml-2" />
                  ))}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="flex items-center cursor-pointer"
                onClick={() => handleSort("category")}
              >
                Category
                {sortConfig.field === "category" &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUpIcon className="w-4 h-4 pt-1 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 pt-1 ml-2" />
                  ))}
              </TableHead>
              <TableHead
                onClick={() => handleSort("amount")}
                className="text-right"
              >
                <div className="flex items-center justify-end cursor-pointer">
                  <p>Amount</p>
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUpIcon className="w-4 h-4 pt-1 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 pt-1 ml-2" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="">Recurring</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell className={"text-center"} colspan={7}>
                  No Transactions Found
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => {
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Checkbox
                        onCheckedChange={() => handleSelect(transaction.id)}
                        checked={selectIds.includes(transaction.id)}
                      />
                    </TableCell>
                    <TableCell className="">
                      {format(new Date(transaction.date), "PP")}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          backgroundColor: categoryColors[transaction.category],
                        }}
                        className={`px-2 py-1 rounded-md text-white text-sm`}
                      >
                        {transaction.category}
                      </span>{" "}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        transaction.type === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {transaction.type === "EXPENSE" ? "-" : "+"} $
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="">
                      {transaction.isRecurring ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge
                                variant={"outline"}
                                className={
                                  "flex items-center gap-2 bg-purple-100 text-purple-600 hover:bg-purple-200"
                                }
                              >
                                <RefreshCcw className="size-4" />
                                {
                                  recurringInterval[
                                    transaction.recurringInterval
                                  ]
                                }
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm font-medium flex items-center">
                                <p>Next Date-</p>
                                <div>
                                  {format(
                                    new Date(transaction.nextRecurringDate),
                                    "PP"
                                  )}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge
                          variant={"outline"}
                          className={"flex items-center gap-2"}
                        >
                          <Clock className="size-4" />
                          One-time
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant={"ghost"}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/transaction/create?edit=${transaction.id}`
                              )
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => bulkDeleteFn([transaction.id])}
                            className={"text-destructive"}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

            {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

    </div>
  );
};

export default AccountTable;
