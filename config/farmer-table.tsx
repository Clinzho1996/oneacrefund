"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import Modal from "@/components/Modal";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { farmerData } from "@/constants";
import {
	IconCloudDownload,
	IconFileExport,
	IconFileImport,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function FarmerDataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [selectedType, setSelectedType] = useState<string>("");
	const [selectedStatus, setSelectedStatus] = useState<string>("View All");
	const [featuredImage, setFeaturedImage] = useState<File | null>(null);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [tableData, setTableData] = useState(data);
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		setFeaturedImage(file);

		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setPreviewImage(null);
		}
	};

	// Function to filter data based on date range
	const filterDataByDateRange = () => {
		if (!dateRange?.from || !dateRange?.to) {
			setTableData(data); // Reset to all data if no date range is selected
			return;
		}

		const filteredData = data.filter((farmer: any) => {
			const dateJoined = new Date(farmer.dateJoined);
			return dateJoined >= dateRange.from! && dateJoined <= dateRange.to!;
		});

		setTableData(filteredData);
	};

	// Update the table data whenever the date range changes
	React.useEffect(() => {
		filterDataByDateRange();
	}, [dateRange]);

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);

		if (status === "View All") {
			setTableData(data); // Reset to all data
		} else {
			const filteredData = farmerData?.filter(
				(farmer) =>
					farmer.biometricStatus?.toLocaleLowerCase() === status.toLowerCase()
			);
			setTableData(filteredData as TData[]);
		}
	};

	const handleDelete = () => {
		const selectedRowIds = Object.keys(rowSelection).filter(
			(key) => rowSelection[key]
		);
		const filteredData = tableData.filter(
			(_, index) => !selectedRowIds.includes(index.toString())
		);
		setTableData(filteredData);
		setRowSelection({});
	};

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
		},
	});

	return (
		<div className="rounded-lg border-[1px] py-0">
			<Modal isOpen={isModalOpen} onClose={closeModal} title="Add Farmer">
				<div className="bg-white py-1 rounded-lg w-[600px] transition-transform ease-in-out max-h[70vh] overflow-y-auto">
					<div className="mt-3 border-t-[1px] border-[#E2E4E9] pt-2">
						<div>
							<p className="text-sm text-dark-1">Basic Information</p>

							<div className="flex flex-col gap-2 mt-4">
								<div className="flex flex-row gap-3 justify-between items-center">
									<div>
										<p className="text-xs text-primary-6 font-inter">
											First Name
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
									<div>
										<p className="text-xs text-primary-6 font-inter">
											Last Name
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
								</div>
								<div className="flex flex-row gap-3 justify-between items-center">
									<div>
										<p className="text-xs text-primary-6 mt-2 font-inter">
											Phone Number
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
									<div>
										<p className="text-xs text-primary-6 mt-2 font-inter">
											OAF-ID (One acre ID)
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
								</div>
							</div>
						</div>
						<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
						<div className="mt-4">
							<p className="text-sm text-dark-1">Location</p>

							<div className="flex flex-col gap-2 mt-2">
								<div className="flex flex-row gap-3 justify-between items-center">
									<div>
										<p className="text-xs text-primary-6 font-inter">State</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
									<div>
										<p className="text-xs text-primary-6 font-inter">
											District
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
								</div>
								<div className="flex flex-row gap-3 justify-between items-center">
									<div>
										<p className="text-xs text-primary-6 font-inter">
											POD/Sector
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
									<div>
										<p className="text-xs text-primary-6 font-inter">
											Site Name
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
								</div>
								<div className="flex flex-col gap-2">
									<div>
										<p className="text-xs text-primary-6 mt-2 font-inter">
											Group Name
										</p>
										<Input type="text" className="focus:border-none mt-2 h-5" />
									</div>
								</div>
							</div>
						</div>
						<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />

						<div>
							<p className="text-xs text-primary-6 font-inter">Upload Image</p>
							<div className="flex flex-col justify-center items-center gap-3 p-3 border-dashed border rounded-lg mt-3 mb-4">
								<IconCloudDownload size={14} />
								<p className="text-xs font-inter text-[#4B5563]">
									Choose a file
								</p>
								<input
									type="file"
									accept="image/*"
									className="hidden"
									id="fileInput"
									onChange={handleFileChange}
								/>
								<Button
									className="border text-xs p-2"
									onClick={() => document.getElementById("fileInput")?.click()}>
									Browse File
								</Button>
								{previewImage && (
									<div className="mt-2 flex flex-row justify-start items-center gap-3">
										<Image
											src={previewImage}
											width={100}
											height={100}
											alt="Preview"
											className="w-[200px] h-[200px] object-cover rounded-md"
										/>
										<Button
											onClick={() => {
												setFeaturedImage(null);
												setPreviewImage(null);
											}}
											className="border text-xs p-2">
											Remove
										</Button>{" "}
									</div>
								)}
							</div>
						</div>

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
			<div
				className="bg-white flex flex-row border-b-[1px] border-[#E2E4E9] justify-between items-center p-3"
				style={{
					borderTopLeftRadius: "0.5rem",
					borderTopRightRadius: "0.5rem",
				}}>
				<div>
					<div className="flex flex-row justify-start items-center gap-2">
						<Image
							src="/images/staffm.png"
							alt="staff management"
							height={20}
							width={20}
						/>
						<p className="text-sm text-dark-1 font-medium font-inter">
							Farmer Management
						</p>
					</div>

					<p className="text-xs text-primary-6 mt-3">
						Helping farmers plan, organize, and manage their farms efficiently
						to increase productivity and profitability.
					</p>
				</div>
				<div className="flex flex-row justify-start items-center gap-3 font-inter">
					<Button className="border-[#E8E8E8] border-[1px]">
						<IconFileExport /> Export
					</Button>
					<Button className="border-[#E8E8E8] border-[1px]">
						<IconFileImport /> Import
					</Button>
					<Button
						className="bg-primary-1 text-white font-inter"
						onClick={openModal}>
						<IconPlus /> Add Farmer
					</Button>
				</div>
			</div>

			{/* filter function */}
			<div className="p-3 flex flex-row justify-between border-b-[1px] border-[#E2E4E9] bg-white items-center gap-20 max-w-full">
				<div className="flex flex-row justify-center bg-white items-center rounded-lg mx-auto special-btn-farmer pr-2">
					{["View All", "Both", "Facial", "Fingerprint", "None"].map(
						(status, index, arr) => (
							<p
								key={status}
								className={`px-2 py-2 text-center text-sm cursor-pointer border border-[#E2E4E9] overflow-hidden ${
									selectedStatus === status
										? "bg-primary-5 text-dark-1"
										: "text-dark-1"
								} 
			${index === 0 ? "rounded-l-lg firstRound" : ""} 
			${index === arr.length - 1 ? "rounded-r-lg lastRound" : ""}`}
								onClick={() => handleStatusFilter(status)}>
								{status}
							</p>
						)
					)}
				</div>

				<div className="p-3 flex flex-row justify-start items-center gap-3 w-full ">
					<Input
						placeholder="Search Farmer..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="focus:border-none bg-[#F9FAFB]"
					/>
					{/* filter by date */}
					<div className="w-[250px]">
						<DateRangePicker dateRange={dateRange} onSelect={setDateRange} />
					</div>
					<Button
						className="border-[#E8E8E8] border-[1px] bg-white"
						onClick={handleDelete}>
						<IconTrash /> Delete
					</Button>
				</div>
			</div>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="bg-primary-3">
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id} className="bg-primary-3 text-xs">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className="bg-white">
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-left text-xs text-primary-6">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className="flex items-center justify-between bg-white rounded-lg py-3 px-2 border-t-[1px] border-gray-300 mt-2">
				<div className="flex-1 text-xs text-primary-6 text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex items-center space-x-10 lg:space-x-10 gap-3">
					<div className="flex items-center space-x-4 gap-2">
						<p className="text-xs text-primary-6 font-medium">Rows per page</p>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}>
							<SelectTrigger className="h-8 w-[70px] bg-white z-10">
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
							</SelectTrigger>
							<SelectContent side="top" className="bg-white">
								{[5, 10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-[100px] items-center justify-center font-medium text-xs text-primary-6">
						{table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()} pages
					</div>
					<div className="flex items-center space-x-5 gap-2">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeft />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeft />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}>
							<span className="sr-only">Go to next page</span>
							<ChevronRight />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}>
							<span className="sr-only">Go to last page</span>
							<ChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
