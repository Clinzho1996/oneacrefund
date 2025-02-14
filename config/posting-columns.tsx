"use client";

import { ColumnDef, RowSelectionState } from "@tanstack/react-table";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { postingData } from "@/constants";
import { format, isValid, parseISO } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { PostingDataTable } from "./posting-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Posting = {
	id: string;
	serialNumber: string;
	staffName: string;
	date: string;
	state: string;
	district: string;
};

const PostingTable = () => {
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [tableData, setTableData] = useState(postingData);

	const openEditModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setEditModalOpen(true);
	};

	const openModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setModalOpen(true);
	};

	const openDeleteModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setDeleteModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	const closeEditModal = () => {
		setEditModalOpen(false);
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
	};

	const columns: ColumnDef<Posting>[] = [
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
			accessorKey: "serialNumber",
			header: "Serial Number",
			cell: ({ row }) => {
				const serial = row.getValue<string>("serialNumber");

				return <span className="text-xs text-black">{serial}</span>;
			},
		},
		{
			accessorKey: "staffName",
			header: "Staff Name",
			cell: ({ row }) => {
				const staffName = row.getValue<string>("staffName");

				return <span className="text-xs text-primary-6">{staffName}</span>;
			},
		},
		{
			accessorKey: "date",
			header: "Date",
			cell: ({ row }) => {
				const date = parseISO(row.original.date); // Convert to Date object
				return (
					<span className="text-xs text-primary-6">
						{isValid(date) ? format(date, "do MMM. yyyy") : "Invalid Date"}
					</span>
				); // Format if valid
			},
		},
		{
			accessorKey: "state",
			header: "State",
			cell: ({ row }) => {
				const state = row.getValue<string>("state");

				return <span className="text-xs text-primary-6">{state}</span>;
			},
		},
		{
			accessorKey: "district",
			header: "District",
			cell: ({ row }) => {
				const district = row.getValue<string>("district");

				return <span className="text-xs text-primary-6">{district}</span>;
			},
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => {
				const actions = row.original;

				return (
					<div className="flex flex-row justify-start items-center gap-5">
						<Link href={`/device-management/${actions.id}`}>
							<Button className="border-[#E8E8E8] border-[1px] text-xs font-medium text-[#6B7280] font-inter">
								View
							</Button>
						</Link>
					</div>
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
			(row: { id: string }) => !selectedRowIds.includes(row.id)
		);

		// Update the table data
		setTableData(filteredData);

		// Clear the row selection after deletion
		setRowSelection({});
	};

	return (
		<>
			<PostingDataTable columns={columns} data={postingData} />

			{isEditModalOpen && (
				<Modal onClose={closeEditModal} isOpen={isEditModalOpen}>
					<p className="mt-4">
						Are you sure you want to suspend {selectedRow?.name}'s account?
					</p>
					<p className="text-sm text-primary-6">This can't be undone</p>
					<div className="flex flex-row justify-end items-center gap-3 font-inter mt-4">
						<Button
							className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
							onClick={closeEditModal}>
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
						Are you sure you want to delete the project:{" "}
						{selectedRow?.projectName}?
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

export default PostingTable;
