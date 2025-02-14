// components/ui/date-range-picker.tsx
"use client";

import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Calendar } from "@/components/ui/calendar"; // Assuming you have a Calendar component
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"; // Assuming you have a Popover component
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react"; // Assuming you have the CalendarIcon
import { useState } from "react";
import { DateRange } from "react-day-picker";

export function DateRangePicker({
	dateRange,
	onSelect,
}: {
	dateRange: DateRange | undefined;
	onSelect: (range: DateRange | undefined) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="w-[260px] justify-start text-left font-normal">
					<CalendarIcon className="mr-2 h-4 w-4" />
					{dateRange?.from ? (
						dateRange.to ? (
							<>
								{format(dateRange.from, "MMM dd, yyyy")} -{" "}
								{format(dateRange.to, "MMM dd, yyyy")}
							</>
						) : (
							format(dateRange.from, "MMM dd, yyyy")
						)
					) : (
						<span>Pick a date range</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0 bg-white" align="start">
				<Calendar
					initialFocus
					mode="range"
					defaultMonth={dateRange?.from}
					selected={dateRange}
					onSelect={onSelect}
					numberOfMonths={2}
				/>
			</PopoverContent>
		</Popover>
	);
}
