"use client";

import {
	ColumnDef,
	RowSelectionState
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { projectData } from "@/constants";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { ProjectDataTable } from "./project-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Project = {
	id: string;
	projectName: string;
	startDate: string;
	endDate: string;
	status: "ongoing" | "yet to start" | "close";
};

const ProjectTable = () => {
	const [isRestoreModalOpen, setRestoreModalOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);
const [isModalOpen, setModalOpen] = useState(false);

	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [tableData, setTableData] = useState(projectData);

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

	const columns: ColumnDef<Project>[] = [
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
			accessorKey: "projectName",
			header: "Project Name",
			cell: ({ row }) => {
				const name = row.getValue<string>("projectName");

				return <span className="text-xs text-black">{name}</span>;
			},
		},
		{
			accessorKey: "startDate",
			header: "Start Date",
			cell: ({ row }) => {
				const startDate = row.getValue<string>("startDate");

				return <span className="text-xs text-primary-6">{startDate}</span>;
			},
		},
		{
			accessorKey: "endDate",
			header: "End Date",
			cell: ({ row }) => {
				const endDate = row.getValue<string>("endDate");

				return <span className="text-xs text-primary-6">{endDate}</span>;
			},
		},
		{
			accessorKey: "status",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						className="text-[13px] text-start items-start"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}>
						Status
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const status = row.getValue<string>("status");
				return (
					<div
						className={`status ${
							status === "ongoing"
								? "green"
								: status === "yet to start"
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
					<div className="flex flex-row justify-start items-center gap-5">
						<Link href={`/projects/${actions.id}`} target="_blank">
							<Button className="border-[#E8E8E8] border-[1px] text-xs font-medium text-[#6B7280] font-inter">
								View Verification
							</Button>
						</Link>
						{actions.status === "ongoing" ? (
							<Link href={`/projects/${actions.id}`} target="_blank">
								<Button className="border-[#E8E8E8] border-[1px] text-xs font-medium text-[#6B7280] font-inter">
									Close
								</Button>
							</Link>
						) : null}

						<Button
							className="border-[#E8E8E8] border-[1px] text-sm font-medium text-[#6B7280] font-inter"
							onClick={() => openDeleteModal(row)}>
							<IconEdit />
						</Button>
						<Button
							className="border-[#E8E8E8] border-[1px] text-sm font-medium text-[#6B7280] font-inter"
							onClick={() => openDeleteModal(row)}>
							<IconTrash />
						</Button>
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
			<ProjectDataTable columns={columns} data={projectData} />

			{isModalOpen && (
					<Modal isOpen={isModalOpen} onClose={closeModal} title="Add Staff">
					<div className="bg-white p-5 rounded-lg w-[600px] transition-transform ease-in-out ">
						<hr className="mt-4 text-[#9F9E9E40]" color="#9F9E9E40" />
						<div className="mt-3 border-t-[1px] border-[#E2E4E9] pt-2">
							<p className="text-sm text-primary-6">Role</p>
	
	
							<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
							<div className="flex flex-col gap-2">
								<p className="text-xs text-primary-6">First Name</p>
								<Input type="text" className="focus:border-none mt-2 h-5" />
								<p className="text-xs text-primary-6 mt-2">Last Name</p>
								<Input type="text" className="focus:border-none mt-2 h-5" />
								<p className="text-xs text-primary-6 mt-2">Email Address</p>
								<Input type="text" className="focus:border-none mt-2 h-5" />
							</div>
							<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
							<div className="flex flex-row justify-end items-center gap-3 font-inter">
								<Button
									className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
									onClick={closeModal}>
									Cancel
								</Button>
								<Button className="bg-primary-1 text-white font-inter text-xs">
									Add
								</Button>
							</div>
						</div>
					</div>
				</Modal>
	
			)}

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

export default ProjectTable;
