"use client";

import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { deviceData } from "@/constants";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { DeviceDataTable } from "./device-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Device = {
	id: string;
	serialNumber: string;
	deviceAlias: string;
	dateJoined: string;
	status: string;
};

const DeviceTable = () => {
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);

	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [tableData, setTableData] = useState(deviceData);

	const openModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setModalOpen(true);
	};

	const openEditModal = (row: any) => {
		setSelectedRow(row.original); // Use row.original to store the full row data
		setEditModalOpen(true);
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

	const columns: ColumnDef<Device>[] = [
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
			accessorKey: "deviceAlias",
			header: "Device Alias",
			cell: ({ row }) => {
				const deviceAlias = row.getValue<string>("deviceAlias");

				return <span className="text-xs text-primary-6">{deviceAlias}</span>;
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
					<div className={`status ${status === "posted" ? "green" : "red"}`}>
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
						<Link href={`/device-management/${actions.id}`}>
							<Button className="border-[#E8E8E8] border-[1px] text-xs font-medium text-[#6B7280] font-inter">
								View
							</Button>
						</Link>
						{actions.status === "not posted" ? (
							<Button
								className="border-[#E8E8E8] border-[1px] text-xs font-medium text-[#6B7280] font-inter"
								onClick={() => openModal(row)}>
								Post
							</Button>
						) : null}

						<Button
							className="border-[#E8E8E8] border-[1px] text-sm font-medium text-[#6B7280] font-inter"
							onClick={() => openEditModal(row)}>
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
			<DeviceDataTable columns={columns} data={deviceData} />

			{isModalOpen && (
				<Modal
					isOpen={isModalOpen}
					onClose={closeModal}
					title="Post Device"
					className="w-[500px]">
					<div className="bg-white py-5 rounded-lg transition-transform ease-in-out ">
						<div className="mt-3 border-t-[1px] border-[#E2E4E9] pt-2">
							<p className="text-sm text-dark-1 font-inter">
								Basic Information
							</p>
							<div className="flex flex-col gap-2 mt-4">
								<p className="text-xs text-primary-6 font-inter">Staff Name</p>
								<Input type="text" className="focus:border-none mt-2 h-5" />
								<div className="flex flex-row items-center justify-between gap-5">
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											State
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											District Name
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
								</div>
								<p className="text-xs text-primary-6 mt-2 font-inter">POD</p>
								<Input type="text" className="focus:border-none mt-2 h-5" />
								<p className="text-xs text-primary-6 mt-2 font-inter">
									Site Name
								</p>
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
									Submit
								</Button>
							</div>
						</div>
					</div>
				</Modal>
			)}

			{isEditModalOpen && (
				<Modal
					isOpen={isEditModalOpen}
					onClose={closeEditModal}
					title="Edit Posted Device"
					className="w-[500px]">
					<div className="bg-white py-5 rounded-lg transition-transform ease-in-out ">
						<div className="mt-3 border-t-[1px] border-[#E2E4E9] pt-2">
							<p className="text-sm text-dark-1 font-inter">
								Basic Information
							</p>
							<div className="flex flex-col gap-2 mt-4">
								<p className="text-xs text-primary-6 font-inter">Staff Name</p>
								<Input type="text" className="focus:border-none mt-2 h-5" />
								<div className="flex flex-row items-center justify-between gap-5">
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											State
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
									<div className="w-[50%] lg:w-full">
										<p className="text-xs text-primary-6 mt-2 font-inter">
											District Name
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
								</div>
								<p className="text-xs text-primary-6 mt-2 font-inter">POD</p>
								<Input type="text" className="focus:border-none mt-2 h-5" />
								<p className="text-xs text-primary-6 mt-2 font-inter">
									Site Name
								</p>
								<Input type="text" className="focus:border-none mt-2 h-5" />
							</div>
							<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
							<div className="flex flex-row justify-end items-center gap-3 font-inter">
								<Button
									className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
									onClick={closeEditModal}>
									Cancel
								</Button>
								<Button className="bg-primary-1 text-white font-inter text-xs">
									Submit
								</Button>
							</div>
						</div>
					</div>
				</Modal>
			)}

			{isDeleteModalOpen && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<p className="mt-4">
						Are you sure you want to delete this device: {""}
						{selectedRow?.deviceAlias}?
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

export default DeviceTable;
