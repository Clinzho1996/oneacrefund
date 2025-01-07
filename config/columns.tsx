"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconEye, IconRestore, IconTrash } from "@tabler/icons-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Staff = {
	id: string;
	name: string;
	date: string;
	role: string;
	staff: string;
	status: "active" | "inactive";
	email: string;
};

export const columns: ColumnDef<Staff>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="text-[13px] text-left"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const name = row.getValue<string>("name");

			return <span className="text-xs text-black">{name}</span>;
		},
	},
	{
		accessorKey: "staff",
		header: "Staff Code",
		cell: ({ row }) => {
			const staff = row.getValue<string>("staff");

			return <span className="text-xs text-primary-6">{staff}</span>;
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="text-[13px] text-left"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Email address
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const email = row.getValue<string>("email");

			return <span className="text-xs text-primary-6">{email}</span>;
		},
	},
	{
		accessorKey: "date",
		header: "Date Joined",
		cell: ({ row }) => {
			const date = row.getValue<string>("date");

			return <span className="text-xs text-primary-6">{date}</span>;
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="text-[13px] text-start items-start"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const status = row.getValue<string>("status");
			return (
				<div className={`status ${status === "active" ? "green" : "red"}`}>
					{status}
				</div>
			);
		},
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.getValue<string>("role");

			return (
				<span className="role text-xs text-primary-6 capitalize">{role}</span>
			);
		},
	},
	{
		id: "actions",
		header: "Action",
		cell: ({ row }) => {
			const actions = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-2 bg-white border-[1px] bborder-[#E8E8E8]">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="bg-white">
						<DropdownMenuItem className="cursor-pointer hover:bg-secondary-3">
							<IconEye />
							<p className="text-xs font-inter !important">View</p>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<IconRestore />{" "}
							<p className="text-xs font-inter !important">Suspend</p>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<IconTrash color="#F43F5E" />{" "}
							<p className="text-[#F43F5E] text-xs font-inter !important">
								Delete
							</p>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
