"use client";

import { ColumnDef, RowSelectionState } from "@tanstack/react-table";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { groupData } from "@/constants";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GroupDataTable } from "./group-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Group = {
	id: string;
	groupName?: string;
	siteName?: string;
	pod?: string;
	district?: string;
	state?: string;
};

const GroupTable = () => {
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);

	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [tableData, setTableData] = useState(groupData);

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

	const columns: ColumnDef<Group>[] = [
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
			accessorKey: "groupName",
			header: "Group Name",
			cell: ({ row }) => {
				const group = row.getValue<string>("groupName");

				return <span className="text-xs text-black">{group}</span>;
			},
		},
		{
			accessorKey: "siteName",
			header: "Site Name",
			cell: ({ row }) => {
				const site = row.getValue<string>("siteName");

				return <span className="text-xs text-primary-6">{site}</span>;
			},
		},
		{
			accessorKey: "pod",
			header: "POD / Sector",
			cell: ({ row }) => {
				const pod = row.getValue<string>("pod");

				return <span className="text-xs text-primary-6">{pod}</span>;
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
			accessorKey: "state",
			header: "State",
			cell: ({ row }) => {
				const state = row.getValue<string>("state");

				return <span className="text-xs text-primary-6">{state}</span>;
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
							<Link href={`/staff-management/${actions.id}`}>
								<DropdownMenuItem className="action cursor-pointer hover:bg-secondary-3">
									<IconEye />
									<p className="text-xs font-inter">View</p>
								</DropdownMenuItem>
							</Link>
							<DropdownMenuItem
								className="action cursor-pointer hover:bg-yellow-300"
								onClick={() => openEditModal(row)}>
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
		const filteredData = groupData.filter(
			(row: { id: string }) => !selectedRowIds.includes(row.id)
		);

		// Update the table data
		setTableData(filteredData);

		// Clear the row selection after deletion
		setRowSelection({});
	};

	return (
		<>
			<GroupDataTable columns={columns} data={groupData} />

			{isModalOpen && (
				<Modal
					isOpen={isModalOpen}
					onClose={closeModal}
					title="Add Location"
					className="w-[500px]">
					<div className="bg-white py-5 rounded-lg transition-transform ease-in-out ">
						<hr className="mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
						<div className="mt-3  pt-2">
							<p className="text-xs text-primary-6 font-inter">
								Location Preference
							</p>
							<RadioGroup defaultValue="super-admin">
								<div className="flex flex-row justify-between items-center gap-5">
									<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg w-full mt-2">
										<RadioGroupItem value="super-admin" id="super-admin" />
										<p className="text-sm text-primary-6 whitespace-nowrap">
											Group
										</p>
									</div>
									<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg w-full mt-2">
										<RadioGroupItem value="super-admin" id="super-admin" />
										<p className="text-sm text-primary-6 whitespace-nowrap">
											Site
										</p>
									</div>
									<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg w-full mt-2">
										<RadioGroupItem value="super-admin" id="super-admin" />
										<p className="text-sm text-primary-6 whitespace-nowrap">
											POD / Sector
										</p>
									</div>
									<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg w-full mt-2">
										<RadioGroupItem value="super-admin" id="super-admin" />
										<p className="text-sm text-primary-6 whitespace-nowrap">
											District
										</p>
									</div>
								</div>
							</RadioGroup>
							<div className="flex flex-col gap-2 mt-4">
								<p className="text-xs text-primary-6 font-inter">State</p>
								<Input
									type="text"
									className="focus:border-primary-1 mt-2 h-5 border-[#E8E8E8] border-[1px]"
								/>
								<p className="text-xs text-primary-6 mt-2 font-inter">
									District
								</p>
								<Input
									type="text"
									className="focus:border-primary-1 mt-2 h-5 border-[#E8E8E8] border-[1px]"
								/>
								<p className="text-xs text-primary-6 mt-2 font-inter">
									POD / Sector
								</p>
								<Input
									type="text"
									className="focus:border-primary-1 mt-2 h-5 border-[#E8E8E8] border-[1px]"
								/>
								<p className="text-xs text-primary-6 mt-2 font-inter">
									Site Name
								</p>
								<Input
									type="text"
									className="focus:border-primary-1 mt-2 h-5 border-[#E8E8E8] border-[1px]"
								/>
								<p className="text-xs text-primary-6 mt-2 font-inter">
									Group Name
								</p>
								<Input
									type="text"
									placeholder="Edit Group Name"
									className="focus:border-primary-1 mt-2 h-5 border-[#E8E8E8] border-[1px]"
								/>
							</div>
							<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
							<div className="flex flex-row justify-end items-center gap-3 font-inter">
								<Button
									className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
									onClick={closeEditModal}>
									Cancel
								</Button>
								<Button className="bg-primary-1 text-white font-inter text-xs">
									Save and Close
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
					title="Edit Location"
					className="w-[500px]">
					<div className="bg-white py-5 rounded-lg transition-transform ease-in-out ">
						<hr className="mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
						<div className="mt-3  pt-2">
							<p className="text-xs text-primary-6 font-inter">
								Location Preference
							</p>
							<RadioGroup defaultValue="super-admin">
								<div className="flex flex-row justify-between items-center gap-5">
									<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg w-full mt-2">
										<RadioGroupItem value="super-admin" id="super-admin" />
										<p className="text-sm text-primary-6 whitespace-nowrap">
											Group
										</p>
									</div>
								</div>
							</RadioGroup>
							<div className="flex flex-col gap-2 mt-4">
								<p className="text-xs text-primary-6 font-inter">State</p>
								<Input
									type="text"
									className="focus:border-none mt-2 h-5 border-[#E8E8E8] border-[1px]"
									disabled
								/>
								<p className="text-xs text-primary-6 mt-2 font-inter">
									District
								</p>
								<Input
									type="text"
									className="focus:border-none mt-2 h-5"
									disabled
								/>
								<p className="text-xs text-primary-6 mt-2 font-inter">
									POD / Sector
								</p>
								<Input
									type="text"
									className="focus:border-none mt-2 h-5"
									disabled
								/>
								<p className="text-xs text-primary-6 mt-2 font-inter">
									Site Name
								</p>
								<Input
									type="text"
									className="focus:border-none mt-2 h-5"
									disabled
								/>
								<p className="text-xs text-primary-6 mt-2 font-inter">
									Group Name
								</p>
								<Input
									type="text"
									placeholder="Edit Group Name"
									className="focus:border-none mt-2 h-5 border border-primary-1"
								/>
							</div>
							<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
							<div className="flex flex-row justify-end items-center gap-3 font-inter">
								<Button
									className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
									onClick={closeEditModal}>
									Cancel
								</Button>
								<Button className="bg-primary-1 text-white font-inter text-xs">
									Save and Close
								</Button>
							</div>
						</div>
					</div>
				</Modal>
			)}

			{isDeleteModalOpen && (
				<Modal onClose={closeDeleteModal} isOpen={isDeleteModalOpen}>
					<p className="mt-4">
						Are you sure you want to delete {""}
						{selectedRow?.groupName}?
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
							Yes, Delete
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
};

export default GroupTable;
