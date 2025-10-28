import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays } from "date-fns";

interface DateFilterProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableDates: string[];
}

export function DateFilter({ selectedDate, onDateChange, availableDates }: DateFilterProps) {
  const quickFilters = [
    { label: "Today", value: format(new Date(), "yyyy-MM-dd") },
    { label: "Yesterday", value: format(subDays(new Date(), 1), "yyyy-MM-dd") },
    { label: "Last 7 Days", value: "last-7-days" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span className="font-medium">Filter by date:</span>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        {quickFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedDate === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => onDateChange(filter.value)}
            data-testid={`button-filter-${filter.value}`}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <Select value={selectedDate} onValueChange={onDateChange}>
        <SelectTrigger className="w-[180px]" data-testid="select-date-filter">
          <SelectValue placeholder="Select a date" />
        </SelectTrigger>
        <SelectContent>
          {availableDates.map((date) => (
            <SelectItem key={date} value={date} data-testid={`select-item-${date}`}>
              {format(new Date(date), "MMM dd, yyyy")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
