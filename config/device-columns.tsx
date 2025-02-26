"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { format, isValid, parseISO } from "date-fns";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DeviceDataTable } from "./device-table";

export type Device = {
	alias: string;
	created_at: string;
	serial_number: string;
	id: string;
	serialNumber: string;
	deviceAlias: string;
	dateJoined: string;
	status: string;
};

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

const DeviceTable = () => {
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tableData, setTableData] = useState<Device[]>([]);

	const openModal = (row: any) => {
		setSelectedRow(row.original);
		setModalOpen(true);
	};

	const openEditModal = (row: any) => {
		setSelectedRow(row.original);
		setEditModalOpen(true);
	};

	const openDeleteModal = (row: any) => {
		setSelectedRow(row.original);
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

	const fetchDevices = async () => {
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
				data: Device[];
			}>("https://api.wowdev.com.ng/api/v1/device", {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const fetchedData = response.data.data;

			console.log("Device Data:", fetchedData);

			const mappedData = fetchedData.map((item) => ({
				id: item.id,
				serialNumber: item.serial_number || "N/A",
				dateJoined: item.created_at,
				deviceAlias: item.alias,
				alias: item.alias,
				created_at: item.created_at,
				serial_number: item.serial_number,
				status: item.status || "not posted",
			}));

			console.log("Mapped Data:", mappedData);
			setTableData(mappedData);
		} catch (error) {
			console.error("Error fetching device data:", error);
			toast.error("Failed to fetch devices. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchDevices();
	}, []);

	const deleteDevice = async (id: string) => {
		try {
			const session = await getSession();
			const accessToken = session?.backendData?.token;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.delete(
				`https://api.wowdev.com.ng/api/v1/device/${id}`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.status === 200) {
				setTableData((prevData) =>
					prevData.filter((device) => device.id !== id)
				);
				toast.success("Device deleted successfully.");
			}
		} catch (error) {
			console.error("Error deleting device:", error);
			toast.error("Failed to delete device. Please try again.");
		}
	};

	const handleEdit = async (updatedDevice: Device) => {
		try {
			const session = await getSession();
			const accessToken = session?.backendData?.token;

			if (!accessToken) {
				console.error("No access token found.");
				return;
			}

			const response = await axios.put(
				`https://api.wowdev.com.ng/api/v1/device/${updatedDevice.id}`,
				updatedDevice,
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.status === 200) {
				setTableData((prevData) =>
					prevData.map((device) =>
						device.id === updatedDevice.id ? updatedDevice : device
					)
				);

				toast.success("Device updated successfully.");
			}
		} catch (error) {
			console.error("Error updating device:", error);
			toast.error("Failed to update device. Please try again.");
		}
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
				const date = parseISO(row.original.dateJoined);
				return (
					<span className="text-xs text-primary-6">
						{isValid(date) ? format(date, "do MMM. yyyy") : "Invalid Date"}
					</span>
				);
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
						{actions.status === "unposted" ? (
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

	return (
		<>
			<DeviceDataTable columns={columns} data={tableData} />

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
								<Button
									className="bg-primary-1 text-white font-inter text-xs"
									onClick={() => {
										handleEdit(selectedRow);
										closeEditModal();
									}}>
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
							onClick={async () => {
								await deleteDevice(selectedRow.id);
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
