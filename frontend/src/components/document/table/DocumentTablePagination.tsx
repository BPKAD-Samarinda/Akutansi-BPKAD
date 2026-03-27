import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DocumentTablePaginationProps = {
  totalDocuments: number;
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
};

export default function DocumentTablePagination({
  totalDocuments,
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: DocumentTablePaginationProps) {
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground dark:text-slate-400">
        Total {totalDocuments} dokumen
      </span>

      <div className="flex flex-wrap items-center justify-end gap-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">
            Baris per halaman
          </FieldLabel>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(value) => onRowsPerPageChange(Number(value))}
          >
          <SelectTrigger
              className="h-8 w-20 border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-0 focus-visible:ring-0 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              id="select-rows-per-page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className="w-[85px] min-w-[85px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100"
              align="start"
              side="right"
            >
              <SelectGroup>
                <SelectItem value="10" className="font-semibold">
                  10
                </SelectItem>
                <SelectItem value="25" className="font-semibold">
                  25
                </SelectItem>
                <SelectItem value="50" className="font-semibold">
                  50
                </SelectItem>
                <SelectItem value="100" className="font-semibold">
                  100
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <div className="text-center text-sm font-medium text-gray-700 dark:text-slate-200">
          {currentPage} dari {totalPages}
        </div>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={isPrevDisabled}
                className={
                  isPrevDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-800 dark:hover:text-orange-300"
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (!isPrevDisabled) {
                    onPageChange(currentPage - 1);
                  }
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={isNextDisabled}
                className={
                  isNextDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-800 dark:hover:text-orange-300"
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (!isNextDisabled) {
                    onPageChange(currentPage + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
