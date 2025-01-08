"use client";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart";
import { IconRectangleFilled } from "@tabler/icons-react";

function CustomerEnrollment() {
	const chartData = [
		{ month: "January", total: 186, new: 80, growth: 60 },
		{ month: "February", total: 105, new: 100, growth: 90 },
		{ month: "March", total: 137, new: 120, growth: 70 },
		{ month: "April", total: 73, new: 190, growth: 80 },
		{ month: "May", total: 109, new: 130, growth: 83 },
		{ month: "June", total: 130, new: 140, growth: 55 },
		{ month: "July", total: 93, new: 85, growth: 46 },
		{ month: "August", total: 134, new: 114, growth: 60 },
		{ month: "September", total: 148, new: 127, growth: 70 },
	];

	const chartConfig = {
		Total: {
			label: "Total Customers",
			color: "hsl(var(--chart-1))",
		},
		New: {
			label: "New Customers",
			color: "hsl(var(--chart-2))",
		},
		Growth: {
			label: "Growth Rate",
			color: "hsl(var(--chart-3))",
		},
	} satisfies ChartConfig;

	return (
		<div className=" p-3 bg-white rounded-lg border border-[#E2E4E9]">
			<div className="flex flex-col lg:flex-row justify-between items-center border-b-[1px] border-b-[#E2E4E9] py-2">
				<div className="flex flex-row justify-start gap-2 items-center">
					<Image src="/images/info.png" alt="info" width={20} height={20} />
					<p className="text-sm font-bold text-black">
						Customer Enrollment Rate
					</p>
				</div>
				<div className="flex flex-row justify-end gap-3 items-center">
					<Select>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="Select Year" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup className="bg-white">
								<SelectItem value="2025">2025</SelectItem>
								<SelectItem value="2024">2024</SelectItem>
								<SelectItem value="2023">2023</SelectItem>
								<SelectItem value="2022">2022</SelectItem>
								<SelectItem value="2021">2021</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="py-3 h-fit">
				<ChartContainer config={chartConfig}>
					<LineChart
						height={200}
						accessibilityLayer
						data={chartData}
						margin={{
							top: 10,
							left: 12,
							right: 12,
							bottom: 10,
						}}>
						<CartesianGrid vertical={false} horizontal={true} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={1}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={{ stroke: "#ccc", strokeWidth: 1 }} // Customize cursor for better visual control
							content={({ payload, label }) => {
								if (!payload || payload.length === 0) return null;
								const total = payload.find((p) => p.dataKey === "total")?.value;
								const newCustomers = payload.find(
									(p) => p.dataKey === "new"
								)?.value;
								const growth = payload.find(
									(p) => p.dataKey === "growth"
								)?.value;
								return (
									<div className="custom-tooltip p-3 bg-white border-[1px] shadow-lg border-[#E4E4E7] rounded-lg w-[280px]">
										<p className="text-center font-bold font-inter">{label}</p>
										<div className="flex flex-row flex-wrap mt-3 gap-5 justify-center items-center">
											<div>
												<p className="text-bold font-inter text-xs text-center">
													{total}
												</p>
												<div className="flex flex-row justify-start items-center gap-1">
													<IconRectangleFilled size={10} color="#098E09" />
													<p className="text-primary-6">Total Customers</p>
												</div>
											</div>
											<div>
												<p className="text-bold font-inter text-xs text-center">
													{newCustomers}
												</p>
												<div className="flex flex-row justify-start items-center gap-1">
													<IconRectangleFilled size={10} color="#6E3FF3" />
													<p className="text-primary-6">New Customers</p>
												</div>
											</div>
											<div>
												<p className="text-bold font-inter text-xs text-center">
													{growth}%
												</p>
												<div className="flex flex-row justify-start items-center gap-1">
													<p className="text-primary-6">Customer Growth Rate</p>
												</div>
											</div>
										</div>
									</div>
								);
							}}
						/>
						<Line
							dataKey="total"
							type="monotone"
							stroke="#09A609"
							strokeWidth={2}
							dot={true}
						/>
						<Line
							dataKey="new"
							type="monotone"
							stroke="#6E3FF3"
							strokeWidth={2}
							dot={true}
						/>
						<Line
							dataKey="growth"
							type="monotone"
							stroke="#F39C12"
							strokeWidth={2}
							dot={true}
						/>
					</LineChart>
				</ChartContainer>
			</div>
		</div>
	);
}

export default CustomerEnrollment;
