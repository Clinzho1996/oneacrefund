"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	RowSelectionState,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { data, farmerData } from "@/constants";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";
import { FarmerDataTable } from "./farmer-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Farmer = {
	id: string;
	firstName: string;
	lastName: string;
	groupName: string;
	siteName: string;
	sector: string;
	dateJoined: string;
	biometricStatus: "none" | "facial" | "fingerprint" | "both";
};

const FarmerTable = () => {
	const [isRestoreModalOpen, setRestoreModalOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [tableData, setTableData] = useState(data);

	const openRestoreModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setRestoreModalOpen(true);
	};

	const openDeleteModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setDeleteModalOpen(true);
	};

	const closeRestoreModal = () => {
		setRestoreModalOpen(false);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
	};

	const columns: ColumnDef<Farmer>[] = [
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
					className="check"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="check"
				/>
			),
		},
		{
			accessorKey: "id",
			header: "OAF-ID",
			cell: ({ row }) => {
				const id = row.getValue<string>("id");

				return <span className="text-xs text-black">{id}</span>;
			},
		},
		{
			accessorKey: "firstName",
			header: "First Name",
			cell: ({ row }) => {
				const firstName = row.getValue<string>("firstName");

				return <span className="text-xs text-black">{firstName}</span>;
			},
		},
		{
			accessorKey: "lastName",
			header: "Last Name",
			cell: ({ row }) => {
				const lastName = row.getValue<string>("lastName");

				return <span className="text-xs text-black">{lastName}</span>;
			},
		},
		{
			accessorKey: "groupName",
			header: "Group Name",
			cell: ({ row }) => {
				const groupName = row.getValue<string>("groupName");

				return <span className="text-xs text-primary-6">{groupName}</span>;
			},
		},
		{
			accessorKey: "siteName",
			header: "Site Name",
			cell: ({ row }) => {
				const siteName = row.getValue<string>("siteName");

				return <span className="text-xs text-primary-6">{siteName}</span>;
			},
		},
		{
			accessorKey: "sector",
			header: "Sector",
			cell: ({ row }) => {
				const sector = row.getValue<string>("sector");

				return <span className="text-xs text-primary-6">{sector}</span>;
			},
		},
		{
			accessorKey: "dateJoined",
			header: "Date Joined",
			cell: ({ row }) => {
				const dateJoined = row.getValue<string>("dateJoined");

				return <span className="text-xs text-primary-6">{dateJoined}</span>;
			},
		},
		{
			accessorKey: "biometricStatus",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="text-[13px] text-start items-start"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Biometric Status
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const status = row.getValue<string>("biometricStatus");
				return (
					<div
						className={`status ${
							status === "both"
								? "green"
								: status === "facial"
								? "blue"
								: status === "fingerprint"
								? "yellow"
								: "red"
						}`}>
						{status}
					</div>
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
							<DropdownMenuItem className="action cursor-pointer hover:bg-secondary-3">
								<IconEye />
								<p className="text-xs font-inter">View</p>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="action cursor-pointer hover:bg-yellow-300"
								onClick={() => openRestoreModal(row)}>
								<IconPencil />
								<p className="text-xs font-inter">Edit</p>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="action cursor-pointer hover:bg-red-500"
								onClick={() => openDeleteModal(row)}>
								<IconTrash color="#F43F5E" />
								<p className="text-[#F43F5E] delete text-xs font-inter">
									Delete
								</p>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const handleDelete = () => {
		// Get the selected row IDs
		const selectedRowIds = Object.keys(rowSelection).filter(
			(key) => rowSelection[key]
		);

		// Filter the data to remove the selected rows
		const filteredData = tableData.filter(
			(row) => !selectedRowIds.includes(row.id)
		);

		// Update the table data
		setTableData(filteredData);

		// Clear the row selection after deletion
		setRowSelection({});
	};

	return (
		<>
			<FarmerDataTable columns={columns} data={farmerData} />

			{isRestoreModalOpen && (
				<Modal onClose={closeRestoreModal} isOpen={isRestoreModalOpen}>
					<p className="mt-4">
						Are you sure you want to suspend {selectedRow?.name}'s account?
					</p>
					<p className="text-sm text-primary-6">This can't be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeRestoreModal}>
							Cancel
						</Button>
						<Button className="bg-[#F04F4A] text-white font-inter text-xs modal-delete">
							Yes, Confirm
						</Button>
					</div>
				</Modal>
			)}

			{isDeleteModalOpen && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<p className="mt-4">
						Are you sure you want to delete {selectedRow?.firstName}'s account?
					</p>

					<p className="text-sm text-primary-6">This can't be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeDeleteModal}>
							Cancel
						</Button>
						<Button
							className="bg-[#F04F4A] text-white font-inter text-xs modal-delete"
							onClick={() => {
								handleDelete();
								closeDeleteModal();
							}}>
							Yes, Confirm
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
};

export default FarmerTable;
