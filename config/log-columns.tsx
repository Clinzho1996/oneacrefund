"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	RowSelectionState,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { format, isValid, parseISO } from "date-fns";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { LogDataTable } from "./log-table";

// This type is used to define the shape of our data.
export type Logs = {
	id: string;
	fullName: string;
	date: string;
	module: string;
	action: string;
	actions: string;
	description: string;
	user: {
		first_name: string;
		last_name: string;
		staff_code: string;
	};
	model: string;
	desc: {
		name: string;
	};
	created_at: string;
};

const LogTable = () => {
	const [isRestoreModalOpen, setRestoreModalOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [tableData, setTableData] = useState<Logs[]>([]);

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

	const columns: ColumnDef<Logs>[] = [
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
			accessorKey: "fullName",
			header: "Full Name",
			cell: ({ row }) => {
				const fullName = row.getValue<string>("fullName");

				return (
					<span className="text-xs text-black capitalize">{fullName}</span>
				);
			},
		},
		{
			accessorKey: "staffCode",
			header: "Staff Code",
			cell: ({ row }) => {
				const staffCode = row.getValue<string>("staffCode");

				return (
					<span className="text-xs text-black capitalize">{staffCode}</span>
				);
			},
		},
		{
			accessorKey: "date",
			header: "Date of action",
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
			accessorKey: "module",
			header: "Module",
			cell: ({ row }) => {
				const module = row.getValue<string>("module");

				return <span className="text-xs text-primary-6">{module}</span>;
			},
		},
		{
			accessorKey: "actions",
			header: "Action",
			cell: ({ row }) => {
				const actions = row.getValue<string>("actions");

				return (
					<span className="role text-xs text-primary-6 capitalize">
						{actions}
					</span>
				);
			},
		},
		{
			accessorKey: "desc",
			header: "Description",
			cell: ({ row }) => {
				const description = row.original.description;

				return (
					<span className="role text-xs text-primary-6 capitalize">
						{description}
					</span>
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

	const fetchLogs = async () => {
		try {
			setIsLoading(true);
			const session = await getSession();

			console.log("session", session);

			const accessToken = session?.backendData?.token;
			if (!accessToken) {
				console.error("No access token found.");
				setIsLoading(false);
				return;
			}

			const response = await axios.get<{
				status: string;
				message: string;
				data: Logs[];
			}>("https://api.wowdev.com.ng/api/v1/log", {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const fetchedData = response.data.data;

			console.log("Log Data:", response.data);

			// Map the API response to match the `Logs` type
			const mappedData = fetchedData.map((item) => ({
				id: item.id,
				fullName: `${item.user.first_name} ${item.user.last_name}` || "N/A",
				date: item.created_at,
				module: item.model,
				action: item.action,
				staffCode: item.user.staff_code,
				actions: item.action,
				description: item.desc.name || "N/A",
				user: item.user, // Include the full user object
				model: item.model,
				desc: item.desc, // Include the full desc object
				created_at: item.created_at,
			}));

			console.log("Mapped Data:", mappedData);
			setTableData(mappedData);
		} catch (error) {
			console.error("Error fetching log data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs();
	}, []);

	return (
		<>
			<LogDataTable columns={columns} data={tableData} />

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
					<p>Are you sure you want to delete {selectedRow?.name}'s account?</p>

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

export default LogTable;
